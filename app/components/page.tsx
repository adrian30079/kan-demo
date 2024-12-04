import { InspectTabComponent } from './inspect-tab'
import postsData from './data-post.json'

export default function Page() {
  return (
    <InspectTabComponent posts={postsData.posts} />
  )
} 