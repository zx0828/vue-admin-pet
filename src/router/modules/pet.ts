import { $t } from "@/plugins/i18n";

export default {
  path: "/pet",
  redirect: "/pet/index",
  meta: {
    icon: "streamline:pet-paw",
    // showLink: false,
    title: $t("menus.purePet"),
    rank: 10
  },
  children: [
    {
      path: "/pet/index",
      name: "pet",
      component: () => import("@/views/pet/index.vue"),
      meta: {
        title: $t("menus.purePetQuery"),
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
