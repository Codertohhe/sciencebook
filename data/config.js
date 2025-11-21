const PRODUCTION_MODE = true;
const appdb = {
  config: {
    subject: "",
    class: "Class 3",
    id: "riz_569",
    totalPages: 144,
    bookWidth: 1259,
    bookHeight: 1646,
    prePages: [
      { pageUrl: "cover.jpg", pageName: "Cover" },
      { pageUrl: "blank.jpg", pageName: "Blank" },
    ],
  },

  ebook: {
    toc: {
      icon: "fa-book",
      menu: "Table of Contents",
      link: "content",
      data: [
        {
          page: 7,
          title: "1. Living and Non-living Things",
        },
        {
          page: 16,
          title: "2. Parts of a Plant",
        },
      ],
    },
    Animations: {
      icon: "fa-film",
      menu: "Animations",
      link: "iframe",
      data: [
        {
          path: "https://drive.google.com/file/d/1YldDrx-HJftgoJ7PxzZvMXlyFz1lD9qE/preview",
          title: "Living and Non-living Things",
          size: "850x480",
          page: 7,
          chapter: "Chapter 1",
        },

        {
          path: "resources/animations/ch_2_1.mp4",
          title: "Parts of a Plant",
          size: "850x480",
          page: 16,
          chapter: "Chapter 2",
        },
      ],
    },
    "Interactivities.": {
      icon: "fa-pencil",
      menu: "Activities",
      link: "iframe",
      data: [
        {
          path: "resources/interactivities/fib/chap_1_fib_1.html",
          title: "Chapter 1, Activity B",
          size: "1024x600",
          page: 11,
        },
        {
          path: "resources/interactivities/tf/chap_1_tf_1.html",
          title: "Chapter 1, Activity C",
          size: "1024x730",
          page: 11,
        },

        {
          path: "resources/interactivities/fib/chap_1_fib_2.html",
          title: "Chapter 1, Activity F",
          size: "1024x550",
          page: 12,
        },
        {
          path: "resources/interactivities/satq/chap_1_satq_1.html",
          title: "Chapter 1, Activity G",
          size: "1024x750",
          page: 12,
        },
        {
          path: "resources/interactivities/mtf/chap_2_mtf_1.html",
          title: "Chapter 2, Activity B",
          size: "1024x630",
          page: 22,
        },
        {
          path: "resources/interactivities/fib/chap_2_fib_1.html",
          title: "Chapter 2, Activity C",
          size: "1024x580",
          page: 23,
        },
        {
          path: "resources/interactivities/satq/chap_2_satq_1.html",
          title: "Chapter 2, Activity E",
          size: "1024x750",
          page: 23,
        },
        {
          path: "resources/interactivities/satq/chap_2_satq_2.html",
          title: "Chapter 2, Activity F",
          size: "1024x750",
          page: 23,
        },
      ],
    },

    "Test Generator.": {
      icon: "fa-file-text",
      menu: "Test Generator",
      link: "iframe",
      data: [
        {
          path: "resources/test_generator/index.html",
          title: "Test Generator",
          size: "1380x900",
          //page: 00,
        },
      ],
    },
    // "Games.": {
    //   icon: "fa-users",
    //   menu: "Games",
    //   link: "iframe",
    //   data: [
    // {
    //   path: "",
    //   title: "Coming Soon",
    //   size: "1024x800",
    //   page: "",
    // },
    // {
    //   path: "resources/interactivities/fib/chap_2_fib_1.html",
    //   title: "Chapter 1, Activity A",
    //   size: "1100x900",
    //   page: 22,
    // },
    //   ],
    // },
    // "Test Paper Generator.": {
    //   icon: "fa-users",
    //   menu: "Test Paper Generator",
    //   link: "iframe",
    //   data: [
    // {
    //   path: "",
    //   title: "Coming Soon",
    //   size: "1024x800",
    //   page: "",
    // },
    // {
    //   path: "resources/interactivities/fib/chap_2_fib_1.html",
    //   title: "Chapter 1, Activity A",
    //   size: "1100x900",
    //   page: 22,
    // },
    //   ],
    // },

    zother: [],
  },
};

var TOOLS_OPTIONS = {
  sidebar: {
    activate: true,
    id: "tool-sidebar",
  },
  notes: {
    activate: true,
    id: "ebook-addnote",
  },
  zoomin: {
    activate: true,
    id: "tool-zoom-in",
  },
  zoomout: {
    activate: true,
    id: "tool-zoom-out",
  },
  mode: {
    activate: true,
    id: "tool-bookmode-single-double",
  },
  fullscreen: {
    activate: true,
    id: "tool-fullscreen",
  },
  assetmode: {
    activate: true,
    id: "app-btn-toggleres",
  },
  spotlight: {
    activate: true,
    id: "app-btn-spotlight",
  },
  backgroundmusic: {
    activate: true,
    id: "tool-backgroundmusic",
  },
  pen: {
    activate: true,
    id: "app-tool-pen",
  },
  highlighter: {
    activate: true,
    id: "app-tool-highlight",
  },
  thumbnail: {
    activate: true,
    id: "app-tool-thumbnail",
  },
  glossary: {
    activate: false,
    id: "app-btn-glossary",
  },
  bookmarkslist: {
    activate: true,
    id: "app-list-bookmark",
  },
  highlightsList: {
    activate: true,
    id: "app-list-highlights",
  },
  notesList: {
    activate: true,
    id: "app-list-notes",
  },
};
