/**
 * 客戶端 IP 獲取工具
 * 統一處理從請求中提取真實客戶端 IP 的邏輯
 */

import type { H3Event } from 'h3';

/**
 * 獲取客戶端 IP 地址
 * 優先順序：
 * 1. x-forwarded-for (代理標頭，取第一個 IP)
 * 2. x-real-ip (Nginx 常用)
 * 3. socket.remoteAddress (直接連接)
 *
 * @param event - H3 事件對象
 * @returns 客戶端 IP 地址，無法獲取時返回 'unknown'
 */
export function getClientIP(event: H3Event): string {
  // 1. 檢查 x-forwarded-for 標頭（可能包含多個 IP，以逗號分隔）
  const forwardedHeader = getHeader(event, 'x-forwarded-for');
  if (typeof forwardedHeader === 'string' && forwardedHeader) {
    const parts = forwardedHeader.split(',');
    if (parts.length > 0 && parts[0]) {
      return parts[0].trim();
    }
  }

  // 2. 檢查 x-real-ip 標頭
  const realIPHeader = getHeader(event, 'x-real-ip');
  if (typeof realIPHeader === 'string' && realIPHeader) {
    return realIPHeader;
  }

  // 3. 從 socket 獲取（直接連接的情況）
  const socketAddress = event.node.req.socket?.remoteAddress;
  if (socketAddress) {
    // 處理 IPv6 格式 (::ffff:192.168.1.1 -> 192.168.1.1)
    if (socketAddress.startsWith('::ffff:')) {
      return socketAddress.substring(7);
    }
    return socketAddress;
  }

  // 無法獲取 IP
  return 'unknown';
}
