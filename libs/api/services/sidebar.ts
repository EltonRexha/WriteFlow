import axios from '@/config/axios';

export interface PopularBlog {
  id: string;
  title: string;
  createdAt: string;
  Author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface PopularWriter {
  id: string;
  name: string | null;
  image: string | null;
  Blogs: {
    title: string;
    _count: {
      likedBy: number;
      viewedBy: number;
    };
  }[];
  _count: {
    Blogs: number;
    FollowedBy: number;
  };
}

export interface SidebarContent {
  popularBlogs: PopularBlog[];
  popularWriters: PopularWriter[];
}

const sidebarApi = {
  getSidebarContent: async (): Promise<SidebarContent> => {
    const res = await axios.get<SidebarContent>('/recommendation/sidebar');
    return res.data;
  },
};

export default sidebarApi;
