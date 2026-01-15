/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Enable static export for GitHub Pages
  output: 'export',
  
  // Base path for GitHub Pages (if your repo name is not the root)
  // Uncomment and set if your site is deployed to a subdirectory
  // basePath: '/cv',
  
  // 處理 webpack 配置以避免重複載入
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 避免重複載入某些庫
      config.resolve.alias = {
        ...config.resolve.alias,
      }
      
      // 優化模組解析
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      }
    }
    return config
  },
  
  // 開發模式配置
  ...(process.env.NODE_ENV === 'development' && {
    // 開發模式特定配置
  }),
}

module.exports = nextConfig
