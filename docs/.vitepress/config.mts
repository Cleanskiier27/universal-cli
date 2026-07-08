import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "The NetworkBuster Times",
  description: "Official Documentation & News",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Implementation', link: '/IMPLEMENTATION_GUIDE' },
      { text: 'AI Training', link: '/AI_TRAINING_AND_DATA_PERSONALIZATION' },
    ],

    sidebar: [
      {
        text: 'Front Page News',
        items: [
          { text: 'Implementation Guide', link: '/IMPLEMENTATION_GUIDE' },
          { text: 'AI Training & Data', link: '/AI_TRAINING_AND_DATA_PERSONALIZATION' },
          { text: 'Keepalive Protocols', link: '/KEEPALIVE' },
          { text: 'Developer Readme', link: '/README-DEVELOPER' },
        ]
      },
      {
        text: 'Classifieds & Special Reports',
        items: [
          { text: 'Network Boost', link: '/NETWORK-BOOST' },
          { text: 'Recycling AI', link: '/RECYCLING-AI' },
          { text: 'Sterilization', link: '/STERILIZATION' },
          { text: 'Sterilization Checklist', link: '/STERILIZATION_CHECKLIST' },
          { text: 'NASA Technichal Transfer Bounty', link: '/MOONBASE-ALPHA' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/NetworkBuster/networkbuster.net' }
    ]
  }
})
