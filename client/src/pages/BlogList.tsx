import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function BlogList() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/list'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Novedades, consejos y guías sobre inversión en lotes y bienes raíces
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400">No hay publicaciones disponibles.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <article
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                  data-testid={`card-blog-${post.id}`}
                >
                  {post.imagenes && post.imagenes.length > 0 && (
                    <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img
                        src={post.imagenes[0].startsWith('/') ? post.imagenes[0] : `/${post.imagenes[0]}`}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-blog-${post.id}`}
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.fecha}>
                        {new Date(post.fecha).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {post.titulo}
                    </h2>
                    {post.subtitulo && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                        {post.subtitulo}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                      Leer más
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
