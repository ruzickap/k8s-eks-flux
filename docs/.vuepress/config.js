module.exports = {
  title: 'Amazon EKS and Flux',
  description: 'Few nots about Amazon EKS and Flux',
  base: "/k8s-eks-flux/",
  head: [['link', { rel: 'icon', href: 'https://raw.githubusercontent.com/cncf/artwork/40e2e8948509b40e4bad479446aaec18d6273bf2/projects/kubernetes/icon/color/kubernetes-icon-color.svg' }]],
  themeConfig: {
    logo: 'https://raw.githubusercontent.com/cncf/artwork/04763c0f5f72b23d6a20bfc9c68c88cee805dbcc/projects/kubernetes/horizontal/all-blue-color/kubernetes-horizontal-all-blue-color.svg',
    repo: 'ruzickap/k8s-eks-flux',
    contributors: false,
    docsBranch: 'master',
    docsDir: 'docs',
    navbar: [
      { text: 'Home', link: '/' },
      {
        text: 'Links',
        children: [
          { text: 'Amazon EKS', link: 'https://aws.amazon.com/eks/' },
          { text: 'Flux', link: 'https://fluxcd.io/' },
        ]
      },
    ],
    sidebar: [
      '/',
      '/part-01/',
      '/part-02/',
      '/part-cleanup/',
    ],
  },
}
