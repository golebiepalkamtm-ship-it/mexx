"use client";

import { useQuery, gql } from "@apollo/client";

const GET_FEED = gql`
  query GetFeed {
    feed {
      id
      content
      mediaUrl
      likesCount
      commentsCount
      user {
        username
        profilePhoto
      }
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_FEED);

  if (loading)
    return <div className="flex justify-center p-10">Ładowanie feedu...</div>;
  if (error)
    return (
      <div className="flex justify-center p-10 text-red-500">
        Błąd: {error.message}
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-black text-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Mexx Feed</h1>

        <div className="flex flex-col gap-6">
          {data?.feed?.map((post: any) => (
            <div
              key={post.id}
              className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800"
            >
              {post.mediaUrl ? (
                <img
                  src={post.mediaUrl}
                  alt="Post content"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <p className="text-xl p-4 text-center font-bold">
                    {post.content}
                  </p>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-bold text-lg">
                      @{post.user?.username || "user"}
                    </p>
                    {post.mediaUrl && (
                      <p className="text-sm opacity-90 mt-1">{post.content}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 items-center">
                    <div className="flex flex-col items-center">
                      <button className="text-2xl hover:scale-110 transition">
                        ❤️
                      </button>
                      <span className="text-xs font-bold">
                        {post.likesCount}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <button className="text-2xl hover:scale-110 transition">
                        💬
                      </button>
                      <span className="text-xs font-bold">
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!data?.feed || data.feed.length === 0) && (
            <div className="text-center p-10 text-gray-500">
              Brak postów. Dodaj coś!
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
