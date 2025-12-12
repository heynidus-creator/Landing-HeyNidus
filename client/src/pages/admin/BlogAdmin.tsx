import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Loader2 } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

type BlogForm = {
  titulo: string;
  subtitulo: string;
  contenido: string;
  fecha: string;
  existingImagenes: string[];
};

const emptyForm: BlogForm = {
  titulo: '',
  subtitulo: '',
  contenido: '',
  fecha: new Date().toISOString().split('T')[0],
  existingImagenes: [],
};

export default function BlogAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [newImagenes, setNewImagenes] = useState<FileList | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me', { credentials: 'include' });
      if (!response.ok) {
        navigate('/admin');
        return;
      }
      loadPosts();
    } catch {
      navigate('/admin');
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/blog/list');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar posts', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setNewImagenes(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (post: BlogPost) => {
    setForm({
      titulo: post.titulo,
      subtitulo: post.subtitulo,
      contenido: post.contenido,
      fecha: post.fecha,
      existingImagenes: post.imagenes || [],
    });
    setNewImagenes(null);
    setEditingId(post.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const removeExistingImage = (imagePath: string) => {
    setForm(prev => ({ ...prev, existingImagenes: prev.existingImagenes.filter(f => f !== imagePath) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('subtitulo', form.subtitulo);
      formData.append('contenido', form.contenido);
      formData.append('fecha', form.fecha);

      if (editingId) {
        formData.append('existingImagenes', JSON.stringify(form.existingImagenes));
      }

      if (newImagenes) {
        Array.from(newImagenes).forEach(file => formData.append('imagenes', file));
      }

      const url = editingId ? `/api/blog/update/${editingId}` : '/api/blog/create';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: 'Guardado', description: editingId ? 'Post actualizado' : 'Post creado' });
        closeForm();
        loadPosts();
      } else {
        const error = await response.json();
        toast({ title: 'Error', description: error.error || 'Error al guardar', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este post?')) return;

    try {
      const response = await fetch(`/api/blog/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: 'Eliminado', description: 'Post eliminado correctamente' });
        loadPosts();
      } else {
        toast({ title: 'Error', description: 'Error al eliminar', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Error de conexión', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} data-testid="button-back-admin">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestión de Blog</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{posts.length} posts</p>
          </div>
          <Button onClick={openCreateForm} className="gap-2" data-testid="button-create-post">
            <Plus className="w-4 h-4" /> Nuevo Post
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
            <Card className="w-full max-w-2xl my-8 bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>{editingId ? 'Editar Post' : 'Nuevo Post'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={closeForm}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Título *</label>
                    <Input value={form.titulo} onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))} required data-testid="input-blog-titulo" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Subtítulo (resumen) *</label>
                    <Textarea value={form.subtitulo} onChange={e => setForm(prev => ({ ...prev, subtitulo: e.target.value }))} required rows={2} data-testid="textarea-blog-subtitulo" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Contenido *</label>
                    <Textarea value={form.contenido} onChange={e => setForm(prev => ({ ...prev, contenido: e.target.value }))} required rows={8} data-testid="textarea-blog-contenido" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Fecha</label>
                    <Input type="date" value={form.fecha} onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))} data-testid="input-blog-fecha" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Imágenes</label>
                    {form.existingImagenes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {form.existingImagenes.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <img src={file} alt="Blog" className="w-20 h-20 object-cover rounded border" />
                            <button type="button" onClick={() => removeExistingImage(file)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">{newImagenes ? `${newImagenes.length} archivos` : 'Subir imágenes'}</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={e => setNewImagenes(e.target.files)} data-testid="input-file-blog-imagenes" />
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting} data-testid="button-submit-blog">
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingId ? 'Guardar cambios' : 'Crear post'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4">
          {posts.map(post => (
            <Card key={post.id} data-testid={`card-admin-blog-${post.id}`}>
              <CardContent className="flex items-center gap-4 p-4">
                {post.imagenes && post.imagenes[0] && (
                  <img src={post.imagenes[0]} alt={post.titulo} className="w-16 h-16 object-cover rounded" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{post.titulo}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{post.subtitulo}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{post.fecha}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(post)} data-testid={`button-edit-blog-${post.id}`}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} data-testid={`button-delete-blog-${post.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No hay posts. Crea el primero.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
