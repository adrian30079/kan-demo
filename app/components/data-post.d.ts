declare module './data-post.json' {
  import { Post } from './post-monitoring-cards'
  
  interface PostData {
    posts: Post[]
  }
  
  const data: PostData
  export default data
}
