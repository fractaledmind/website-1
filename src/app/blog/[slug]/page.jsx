import { previewData as getPreviewData } from 'next/headers';
import { notFound } from 'next/navigation';

import Aside from 'components/pages/blog-post/aside';
import Content from 'components/pages/blog-post/content';
import CTA from 'components/pages/blog-post/cta';
import Hero from 'components/pages/blog-post/hero';
// import SocialShareBar from 'components/pages/blog-post/social-share-bar';
import CodeBlock from 'components/shared/code-block';
import Layout from 'components/shared/layout';
import { getAllWpPosts, getWpPostBySlug, getWpPreviewPostData } from 'utils/api-posts';
import getReactContentWithLazyBlocks from 'utils/get-react-content-with-lazy-blocks';

const BlogPage = async ({ params }) => {
  const previewData = getPreviewData();
  const isPreviewMode = !!previewData;

  let postResult;

  if (isPreviewMode) {
    postResult = await getWpPreviewPostData(previewData.id, previewData.status);
  } else {
    postResult = await getWpPostBySlug(params?.slug);
  }

  const { post, relatedPosts } = postResult;
  if (!post) return notFound();

  const { slug, title, content, pageBlogPost, date, categories } = post;
  const shareUrl = `${process.env.DEFAULT_SITE_URL}/blog/${slug}`;
  const formattedDate = new Date(date).toLocaleDateString(
    {},
    { timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric' }
  );

  const contentWithLazyBlocks = getReactContentWithLazyBlocks(
    content,
    {
      blogpostcode: CodeBlock,
      blogpostcta: CTA,
    },
    true
  );

  return (
    <Layout headerTheme="gray-8" footerTheme="gray-8" footerWithTopBorder isHeaderSticky>
      <div className="safe-paddings bg-gray-new-8 text-white">
        <article className="mx-auto grid max-w-[1472px] grid-cols-12 gap-y-20 gap-x-10 pt-20 pb-40 xl:max-w-[936px] xl:pt-16 lg:max-w-none lg:px-6 lg:pt-12 md:gap-x-0 md:px-4 md:pt-6">
          <Hero
            className="col-start-4 col-end-10 md:col-span-full"
            title={title}
            date={formattedDate}
            category={categories.nodes[0]}
            {...pageBlogPost}
          />

          <Content
            className="prose-invert col-start-4 col-end-10 md:col-span-full sm:mt-4"
            html={contentWithLazyBlocks}
          />
          <Aside
            className="col-span-3 col-end-13 row-start-2"
            title={title}
            slug={shareUrl}
            authors={pageBlogPost.authors}
            posts={relatedPosts}
          />
        </article>

        {/* <SocialShareBar className="hidden md:block" slug={shareUrl} title={title} /> */}
        {isPreviewMode && (
          <a
            href={`/api/exit-preview?slug=${previewData.slug}&pageType=blog`}
            className="t-base fixed left-5 bottom-5 inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-primary-1 px-[26px] py-[11px] text-center font-bold !leading-none text-black outline-none transition-colors duration-200 hover:bg-[#00e5bf]"
          >
            Preview Mode
          </a>
        )}
      </div>
    </Layout>
  );
};

export async function generateStaticParams() {
  const posts = await getAllWpPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default BlogPage;
