import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { Calendar, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog', id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Artículo no encontrado
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Lo sentimos, no pudimos encontrar el artículo que buscas.
          </p>
          <Link href="/blog">
            <button
              className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:underline"
              data-testid="link-back-to-blog"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog">
          <button
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 mb-8 transition-colors"
            data-testid="link-back-to-blog"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </button>
        </Link>

        <article>
          {post.imagenes && post.imagenes.length > 0 && (
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-8">
              <img
                src={post.imagenes[0].startsWith('/') ? post.imagenes[0] : `/${post.imagenes[0]}`}
                alt={post.titulo}
                className="w-full h-full object-cover"
                data-testid="img-blog-hero"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.fecha}>
              {new Date(post.fecha).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {post.titulo}
          </h1>

          {post.subtitulo && (
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              {post.subtitulo}
            </p>
          )}

          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contenido.replace(/\n/g, '<br />') }}
            data-testid="text-blog-content"
          />

          {post.imagenes && post.imagenes.length > 1 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Galería
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {post.imagenes.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700"
                  >
                    <img
                      src={img.startsWith('/') ? img : `/${img}`}
                      alt={`${post.titulo} - imagen ${index + 2}`}
                      className="w-full h-full object-cover"
                      data-testid={`img-blog-gallery-${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
