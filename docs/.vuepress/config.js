import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";

export default defineUserConfig({
  bundler: viteBundler(),

  title: "Amazon EKS and Flux",
  description: "Few nots about Amazon EKS and Flux",
  base: "/k8s-eks-flux/",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://raw.githubusercontent.com/cncf/artwork/40e2e8948509b40e4bad479446aaec18d6273bf2/projects/kubernetes/icon/color/kubernetes-icon-color.svg",
      },
    ],
  ],

  theme: defaultTheme({
    docsDir: "docs",
    docsBranch: "main",
    contributors: false,
    logo: "https://raw.githubusercontent.com/cncf/artwork/04763c0f5f72b23d6a20bfc9c68c88cee805dbcc/projects/kubernetes/horizontal/all-blue-color/kubernetes-horizontal-all-blue-color.svg",
    navbar: [
      {
        text: "Home",
        link: "/",
      },
      {
        text: "Links",
        children: [
          {
            text: "Amazon EKS",
            link: "https://aws.amazon.com/eks/",
          },
          {
            text: "Fux",
            link: "https://fluxcd.io/",
          },
        ],
      },
    ],
    repo: "ruzickap/k8s-eks-flux",
    sidebar: [
      {
        text: "Amazon EKS and Flux",
        link: "/",
      },
      {
        text: "Create initial AWS structure",
        link: "/part-01/",
      },
      {
        text: "Create additional AWS structure",
        link: "/part-02/",
      },
      {
        text: "Base Applications",
        link: "/part-03/",
      },
      {
        text: "Applications",
        link: "/part-04/",
      },
      {
        text: "Examples and tests",
        link: "/part-workloads-01/",
      },
      {
        text: "Clean-up",
        link: "/part-cleanup/",
      },
    ],
  }),
});
