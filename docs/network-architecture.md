# SmartSurvey Pro - 網路架構詳細設計

> 📅 文件版本：v1.0  
> 📝 最後更新：2025-01-10  
> 🌐 網路設計：Multi-layer Security Architecture  
> ☁️ 雲端平台：Google Cloud Platform

---

## 🌍 網路架構總覽

### 完整網路流程圖

```mermaid
graph TB
    subgraph "Internet"
        USER[全球用戶]
        ATTACKER[潛在攻擊者]
    end
    
    subgraph "DNS Layer"
        DNS[Cloud DNS<br/>survey.example.com<br/>*.survey.example.com]
        DNS_RECORDS[A Records → Cloudflare IPs]
    end
    
    subgraph "CDN & Security Layer (Cloudflare)"
        CF_PROXY[Cloudflare Proxy<br/>Anycast Network]
        CF_WAF[Web Application Firewall<br/>OWASP Rules]
        CF_DDOS[DDoS Protection<br/>Layer 3/4/7]
        CF_CACHE[Edge Cache<br/>Static Assets]
        CF_RULES[Page Rules<br/>Cache/Redirect]
    end
    
    subgraph "GCP Network Edge"
        GLB[Global Load Balancer<br/>Premium Tier]
        SSL[SSL/TLS Termination<br/>Managed Certificates]
        CDN_IC[Cloud CDN<br/>Additional Cache Layer]
    end
    
    subgraph "Backend Services"
        BACKEND_SERVICE[Backend Service<br/>Health Checks]
        NEG_ZONES[Network Endpoint Groups<br/>asia-east1-a/b/c]
    end
    
    subgraph "Cloud Run Services"
        CR_WEB[survey-web<br/>:3000<br/>Nuxt3 SSR]
        CR_ADMIN[survey-admin<br/>:3001<br/>Vite SPA]
        CR_API[survey-api<br/>:8080<br/>Go API]
    end
    
    subgraph "VPC Connector"
        CONNECTOR[Serverless VPC Connector<br/>10.8.0.0/28]
    end
    
    subgraph "Private Network"
        PRIVATE_SUBNET[Private Subnet<br/>10.0.0.0/24]
    end
    
    subgraph "External Services"
        MONGO[MongoDB Atlas<br/>Peering/PrivateLink]
        REDIS[Redis Cloud<br/>TLS Connection]
        GCS[Cloud Storage<br/>Private Bucket]
    end
    
    USER --> DNS
    ATTACKER --> CF_WAF
    DNS --> DNS_RECORDS
    DNS_RECORDS --> CF_PROXY
    CF_PROXY --> CF_WAF
    CF_WAF --> CF_DDOS
    CF_DDOS --> CF_CACHE
    CF_CACHE --> CF_RULES
    CF_RULES --> GLB
    GLB --> SSL
    SSL --> CDN_IC
    CDN_IC --> BACKEND_SERVICE
    BACKEND_SERVICE --> NEG_ZONES
    NEG_ZONES --> CR_WEB
    NEG_ZONES --> CR_ADMIN
    NEG_ZONES --> CR_API
    CR_WEB --> CONNECTOR
    CR_ADMIN --> CONNECTOR
    CR_API --> CONNECTOR
    CONNECTOR --> PRIVATE_SUBNET
    PRIVATE_SUBNET --> MONGO
    PRIVATE_SUBNET --> REDIS
    CR_WEB --> GCS
    
    style CF_WAF fill:#ff9999
    style CF_DDOS fill:#ff9999
    style GLB fill:#9999ff
    style CR_WEB fill:#99ff99
    style CR_ADMIN fill:#99ff99
    style CR_API fill:#99ff99
```

---

## 🔗 網路層級詳解

### Layer 1: DNS 解析

```yaml
# Cloud DNS 配置
dns_zones:
  - name: survey-example-com
    dns_name: survey.example.com.
    records:
      - type: A
        name: "@"
        ttl: 300
        rrdatas:
          - 104.24.0.1    # Cloudflare IP
          - 104.24.0.2    # Cloudflare IP
      
      - type: A
        name: admin
        ttl: 300
        rrdatas:
          - 104.24.0.1    # Cloudflare IP
          
      - type: A
        name: api
        ttl: 300
        rrdatas:
          - 104.24.0.1    # Cloudflare IP
          
      - type: CNAME
        name: www
        ttl: 300
        rrdatas:
          - survey.example.com.
          
      - type: MX
        name: "@"
        ttl: 3600
        rrdatas:
          - "10 mail.example.com."
          
      - type: TXT
        name: "@"
        ttl: 3600
        rrdatas:
          - "v=spf1 include:_spf.google.com ~all"
```

### Layer 2: Cloudflare 配置

```javascript
// Cloudflare 配置
const cloudflareConfig = {
  // 基本設定
  zone: {
    name: "survey.example.com",
    plan: "Pro",
    settings: {
      ssl: "full_strict",
      always_use_https: true,
      min_tls_version: "1.2",
      automatic_https_rewrites: true,
      brotli: true,
      http3: true,
      websockets: true,
      opportunistic_encryption: true
    }
  },
  
  // WAF 規則
  waf_rules: {
    owasp_rules: "enabled",
    custom_rules: [
      {
        expression: "(cf.threat_score > 30)",
        action: "challenge"
      },
      {
        expression: "(ip.geoip.country in {\"CN\" \"RU\"})",
        action: "managed_challenge"
      },
      {
        expression: "(http.request.uri.path contains \"admin\" and not ip.src in $office_ips)",
        action: "block"
      }
    ]
  },
  
  // DDoS 防護
  ddos_protection: {
    level: "high",
    settings: {
      rate_limiting: {
        threshold: 100,
        period: 60,
        action: "challenge"
      },
      advanced_tcp_protection: true
    }
  },
  
  // 快取規則
  page_rules: [
    {
      target: "*.survey.example.com/assets/*",
      settings: {
        cache_level: "cache_everything",
        edge_cache_ttl: 86400,
        browser_cache_ttl: 86400
      }
    },
    {
      target: "api.survey.example.com/*",
      settings: {
        cache_level: "bypass",
        disable_performance: false
      }
    },
    {
      target: "survey.example.com/survey/*",
      settings: {
        cache_level: "standard",
        edge_cache_ttl: 300
      }
    }
  ]
}
```

### Layer 3: Google Cloud Load Balancer

```yaml
# Load Balancer 配置
load_balancer:
  name: survey-lb
  type: HTTPS
  ip_address: 35.200.x.x  # Premium tier static IP
  ip_version: IPV4
  
  # SSL 憑證
  ssl_certificates:
    - name: survey-cert
      domains:
        - survey.example.com
        - "*.survey.example.com"
      type: MANAGED
      
  # Frontend 配置
  frontend:
    - name: survey-frontend-https
      protocol: HTTPS
      port: 443
      certificate: survey-cert
      
    - name: survey-frontend-http
      protocol: HTTP
      port: 80
      redirect_to_https: true
      
  # Backend 配置
  backend_services:
    - name: survey-web-backend
      protocol: HTTPS
      health_check: survey-web-health
      timeout: 60s
      backends:
        - group: survey-web-neg
          balancing_mode: UTILIZATION
          max_utilization: 0.8
          capacity_scaler: 1.0
          
    - name: survey-admin-backend
      protocol: HTTPS
      health_check: survey-admin-health
      timeout: 30s
      backends:
        - group: survey-admin-neg
          balancing_mode: RATE
          max_rate_per_endpoint: 100
          
    - name: survey-api-backend
      protocol: HTTPS
      health_check: survey-api-health
      timeout: 300s
      backends:
        - group: survey-api-neg
          balancing_mode: UTILIZATION
          max_utilization: 0.8
          
  # URL Map (路由規則)
  url_map:
    default_service: survey-web-backend
    host_rules:
      - hosts: ["survey.example.com", "www.survey.example.com"]
        path_matcher: survey-paths
        
      - hosts: ["admin.survey.example.com"]
        path_matcher: admin-paths
        
      - hosts: ["api.survey.example.com"]
        path_matcher: api-paths
        
    path_matchers:
      - name: survey-paths
        default_service: survey-web-backend
        path_rules:
          - paths: ["/api/*"]
            service: survey-web-backend  # Nitro API
            
      - name: admin-paths
        default_service: survey-admin-backend
        
      - name: api-paths
        default_service: survey-api-backend
        path_rules:
          - paths: ["/health"]
            service: survey-api-backend
            
  # Health Checks
  health_checks:
    - name: survey-web-health
      protocol: HTTPS
      path: /health
      interval: 10s
      timeout: 5s
      healthy_threshold: 2
      unhealthy_threshold: 3
      
    - name: survey-admin-health
      protocol: HTTPS
      path: /
      interval: 30s
      timeout: 5s
      
    - name: survey-api-health
      protocol: HTTPS
      path: /health
      interval: 10s
      timeout: 5s
```

### Layer 4: Network Endpoint Groups (NEG)

```yaml
# NEG 配置
network_endpoint_groups:
  - name: survey-web-neg
    type: serverless
    region: asia-east1
    cloud_run_service: survey-web
    
  - name: survey-admin-neg
    type: serverless
    region: asia-east1
    cloud_run_service: survey-admin
    
  - name: survey-api-neg
    type: serverless
    region: asia-east1
    cloud_run_service: survey-api
```

---

## 🔄 服務間通訊架構

### 內部服務通訊流程

```mermaid
sequenceDiagram
    participant User
    participant CF as Cloudflare
    participant GLB as Load Balancer
    participant Web as survey-web<br/>(Nuxt3)
    participant Admin as survey-admin<br/>(Vite)
    participant API as survey-api<br/>(Go)
    participant VPC as VPC Connector
    participant Mongo as MongoDB Atlas
    participant Redis as Redis Cloud
    participant GCS as Cloud Storage
    
    Note over User,GCS: === 用戶訪問流程 ===
    User->>CF: HTTPS Request<br/>survey.example.com
    CF->>CF: WAF Check
    CF->>CF: DDoS Protection
    CF->>CF: Cache Check
    CF->>GLB: Forward Request<br/>(Cache Miss)
    GLB->>GLB: SSL Termination
    GLB->>Web: Route to NEG<br/>Port 3000
    
    Web->>VPC: Database Query
    VPC->>Mongo: Secure Connection<br/>MongoDB Wire Protocol
    Mongo-->>Web: Return Data
    
    Web->>VPC: Cache Check
    VPC->>Redis: TLS Connection<br/>RESP Protocol
    Redis-->>Web: Cache Data
    
    Web->>GCS: Get Static Assets<br/>Private Access
    GCS-->>Web: Return Assets
    
    Web-->>User: SSR HTML Response
    
    Note over User,GCS: === 管理員訪問流程 ===
    User->>CF: admin.survey.example.com
    CF->>GLB: Forward Request
    GLB->>Admin: Route to Admin NEG<br/>Port 3001
    Admin->>API: REST API Call<br/>Internal HTTPS
    
    API->>VPC: Analytics Query
    VPC->>Mongo: Aggregation Pipeline
    Mongo-->>API: Aggregated Data
    
    API->>VPC: Cache Result
    VPC->>Redis: SET with TTL
    Redis-->>API: OK
    
    API-->>Admin: JSON Response
    Admin-->>User: SPA Response
```

### 服務發現與內部路由

```yaml
# 內部服務 URL
internal_urls:
  # Phase 1-6: 所有服務通過公網 (HTTPS)
  survey_web:
    public: https://survey.example.com
    internal: https://survey-web-xxxxx-uc.a.run.app
    
  survey_admin:
    public: https://admin.survey.example.com
    internal: https://survey-admin-xxxxx-uc.a.run.app
    
  survey_api:
    public: https://api.survey.example.com
    internal: https://survey-api-xxxxx-uc.a.run.app
    
  # Phase 7+: 考慮 Service Mesh
  future_service_mesh:
    type: Anthos Service Mesh
    internal_only: true
```

---

## 🔒 網路安全配置

### 防火牆規則

```yaml
# VPC 防火牆規則
firewall_rules:
  - name: allow-health-checks
    direction: INGRESS
    priority: 1000
    source_ranges:
      - 35.191.0.0/16  # GLB health check
      - 130.211.0.0/22 # GLB health check
    target_tags:
      - cloud-run
    allow:
      - protocol: tcp
        ports: [3000, 3001, 8080]
        
  - name: allow-internal
    direction: INGRESS
    priority: 1100
    source_ranges:
      - 10.0.0.0/24  # Internal subnet
    target_tags:
      - cloud-run
    allow:
      - protocol: tcp
        
  - name: deny-all-external
    direction: INGRESS
    priority: 65534
    source_ranges:
      - 0.0.0.0/0
    target_tags:
      - cloud-run
    deny:
      - protocol: all
```

### VPC Connector 配置

```yaml
# Serverless VPC Connector
vpc_connector:
  name: survey-connector
  region: asia-east1
  network: survey-vpc
  ip_cidr_range: 10.8.0.0/28
  min_instances: 2
  max_instances: 10
  machine_type: e2-micro
  
  # Cloud Run 服務配置
  cloud_run_config:
    survey-web:
      vpc_connector: survey-connector
      vpc_egress: private-ranges-only
      
    survey-admin:
      vpc_connector: survey-connector
      vpc_egress: private-ranges-only
      
    survey-api:
      vpc_connector: survey-connector
      vpc_egress: all-traffic  # 需要訪問外部 API
```

---

## 🗄️ 資料庫網路連接

### MongoDB Atlas 網路配置

```yaml
# MongoDB Atlas Network Peering
mongodb_network:
  type: VPC_PEERING
  atlas_project_id: xxxxx
  atlas_network_container: 10.10.0.0/24
  
  gcp_config:
    project_id: survey-builder
    vpc_name: survey-vpc
    vpc_cidr: 10.0.0.0/24
    
  peering_connection:
    name: gcp-survey-peering
    atlas_cidr: 10.10.0.0/24
    gcp_network: projects/survey-builder/global/networks/survey-vpc
    
  ip_whitelist:
    - cidr: 10.8.0.0/28  # VPC Connector
      comment: Cloud Run services
    - cidr: 35.200.0.0/16  # Cloud Run IPs (backup)
      comment: Cloud Run egress IPs
      
  connection_string:
    standard: "mongodb+srv://user:pass@survey-cluster.xxxxx.mongodb.net/survey_db?retryWrites=true&w=majority"
    private: "mongodb://user:pass@10.10.0.5:27017,10.10.0.6:27017,10.10.0.7:27017/survey_db?replicaSet=atlas-xxxxx"
```

### Redis Cloud 網路配置

```yaml
# Redis Cloud 連接
redis_network:
  type: TLS_CONNECTION
  provider: Redis Cloud
  region: gcp-asia-east1
  
  endpoint:
    host: redis-xxxxx.c250.asia-east1-1.gce.cloud.redislabs.com
    port: 16xxx
    
  security:
    tls: required
    auth: password
    
  connection_pool:
    min_idle: 5
    max_active: 50
    max_idle: 10
    idle_timeout: 300s
    
  vpc_peering:  # Optional for Phase 5+
    enabled: false
    future_config:
      redis_vpc: 10.20.0.0/24
      peering_name: redis-survey-peering
```

---

## 📊 網路性能優化

### CDN 快取策略

```javascript
// Cloudflare Workers (Edge Computing)
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 靜態資源快取
  if (url.pathname.startsWith('/assets/')) {
    const cache = caches.default
    let response = await cache.match(request)
    
    if (!response) {
      response = await fetch(request)
      response = new Response(response.body, response)
      response.headers.set('Cache-Control', 'public, max-age=86400')
      event.waitUntil(cache.put(request, response.clone()))
    }
    
    return response
  }
  
  // API 請求不快取
  if (url.pathname.startsWith('/api/')) {
    return fetch(request, {
      cf: {
        cacheTtl: 0,
        cacheEverything: false
      }
    })
  }
  
  // 預設行為
  return fetch(request)
}
```

### 網路延遲優化

```yaml
# 延遲優化策略
optimization:
  # 1. 地理位置優化
  geo_routing:
    - region: asia
      endpoints:
        - asia-east1
        - asia-southeast1
    - region: us
      endpoints:
        - us-central1
        - us-east1
        
  # 2. 連接池優化
  connection_pools:
    mongodb:
      min_pool_size: 10
      max_pool_size: 100
      max_idle_time: 60000
      
    redis:
      pool_size: 50
      pipeline_limit: 100
      
  # 3. HTTP/2 & HTTP/3
  protocols:
    http2: enabled
    http3: enabled
    quic: enabled
    
  # 4. 預連接
  preconnect:
    - https://mongodb.net
    - https://redislabs.com
    - https://storage.googleapis.com
```

---

## 📈 網路監控

### 監控指標

```yaml
# 網路監控 Dashboard
monitoring_metrics:
  # 延遲指標
  latency:
    - dns_lookup_time: < 50ms
    - tcp_connection_time: < 100ms
    - ssl_handshake_time: < 150ms
    - server_response_time: < 500ms
    - total_page_load_time: < 2000ms
    
  # 流量指標
  traffic:
    - requests_per_second
    - bandwidth_usage
    - cache_hit_ratio: > 80%
    - cdn_bandwidth_saved
    
  # 錯誤率
  errors:
    - 4xx_rate: < 1%
    - 5xx_rate: < 0.1%
    - timeout_rate: < 0.5%
    
  # 安全指標
  security:
    - blocked_requests
    - challenge_solved_rate
    - bot_score_distribution
```

### 告警設置

```yaml
# 網路告警規則
alerts:
  - name: high_latency
    metric: response_time_p95
    threshold: 1000ms
    duration: 5m
    channel: slack
    
  - name: low_cache_hit
    metric: cache_hit_ratio
    threshold: 60%
    duration: 10m
    channel: email
    
  - name: ddos_attack
    metric: requests_per_second
    threshold: 10000
    duration: 1m
    channel: pagerduty
    
  - name: ssl_cert_expiry
    metric: ssl_cert_days_remaining
    threshold: 30
    channel: email
```

---

## 🔧 網路故障排除

### 診斷工具與命令

```bash
# 1. DNS 診斷
dig survey.example.com
nslookup survey.example.com
host -t A survey.example.com

# 2. 網路路徑追蹤
traceroute survey.example.com
mtr survey.example.com

# 3. SSL/TLS 檢查
openssl s_client -connect survey.example.com:443 -servername survey.example.com

# 4. HTTP 頭檢查
curl -I https://survey.example.com
curl -H "CF-Connecting-IP: x.x.x.x" https://survey.example.com

# 5. Load Balancer 健康檢查
gcloud compute backend-services get-health survey-web-backend --global

# 6. Cloud Run 服務狀態
gcloud run services describe survey-web --region=asia-east1

# 7. VPC Connector 狀態
gcloud compute networks vpc-access connectors describe survey-connector --region=asia-east1
```

### 常見網路問題與解決方案

| 問題 | 症狀 | 解決方案 |
|------|------|---------|
| DNS 解析失敗 | 無法訪問網站 | 檢查 DNS 記錄、TTL 設置 |
| SSL 憑證錯誤 | 瀏覽器警告 | 更新憑證、檢查 domain 匹配 |
| 504 Gateway Timeout | 頁面載入超時 | 增加 timeout、優化後端 |
| 高延遲 | 頁面載入慢 | 啟用 CDN、優化路由 |
| Cloud Run 冷啟動 | 首次請求慢 | 設置 min_instances |
| MongoDB 連接失敗 | 資料庫錯誤 | 檢查 VPC Peering、IP 白名單 |
| Redis 連接超時 | 快取失效 | 檢查 TLS 設置、連接池 |

---

## 🚀 網路部署檢查清單

### 部署前檢查

- [ ] DNS 記錄配置正確
- [ ] Cloudflare Proxy 啟用
- [ ] SSL 憑證有效
- [ ] Load Balancer 健康檢查通過
- [ ] NEG 正確關聯 Cloud Run
- [ ] VPC Connector 建立
- [ ] MongoDB Atlas Peering/Whitelist
- [ ] Redis Cloud TLS 配置
- [ ] 防火牆規則設置
- [ ] 監控告警配置

### 部署後驗證

- [ ] 所有域名可訪問
- [ ] HTTPS 重定向正常
- [ ] 靜態資源 CDN 快取
- [ ] API 響應時間 < 500ms
- [ ] 資料庫連接正常
- [ ] Redis 快取命中率 > 80%
- [ ] 無異常錯誤日誌
- [ ] 監控數據正常

---

*本文檔詳細說明了 SmartSurvey Pro 的網路架構設計，從 DNS 到資料庫的完整網路流程*