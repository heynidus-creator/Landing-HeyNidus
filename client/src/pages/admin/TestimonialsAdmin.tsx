import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Loader2, Check, XCircle } from 'lucide-react';
import type { Testimonial } from '@shared/schema';

type TestimonialForm = {
  autor: string;
  rol: string;
  contenido: string;
  aprobado: boolean;
  existingImagen: string;
};

const emptyForm: TestimonialForm = {
  autor: '',
  rol: '',
  contenido: '',
  aprobado: false,
  existingImagen: '',
};

export default function TestimonialsAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [newImagen, setNewImagen] = useState<File | null>(null);

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
      loadTestimonials();
    } catch {
      navigate('/admin');
    }
  };

  const loadTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials/list-admin', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar testimonios', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setNewImagen(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (testimonial: Testimonial) => {
    setForm({
      autor: testimonial.autor,
      rol: testimonial.rol,
      contenido: testimonial.contenido,
      aprobado: testimonial.aprobado,
      existingImagen: testimonial.imagen || '',
    });
    setNewImagen(null);
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('autor', form.autor);
      formData.append('rol', form.rol);
      formData.append('contenido', form.contenido);
      formData.append('aprobado', String(form.aprobado));

      if (editingId && form.existingImagen) {
        formData.append('existingImagen', form.existingImagen);
      }

      if (newImagen) {
        formData.append('imagen', newImagen);
      }

      const url = editingId ? `/api/testimonials/update/${editingId}` : '/api/testimonials/create';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: 'Guardado', description: editingId ? 'Testimonio actualizado' : 'Testimonio creado' });
        closeForm();
        loadTestimonials();
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

  const handleToggleApproval = async (testimonial: Testimonial) => {
    try {
      const formData = new FormData();
      formData.append('autor', testimonial.autor);
      formData.append('rol', testimonial.rol);
      formData.append('contenido', testimonial.contenido);
      formData.append('aprobado', String(!testimonial.aprobado));
      formData.append('existingImagen', testimonial.imagen);

      const response = await fetch(`/api/testimonials/update/${testimonial.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: testimonial.aprobado ? 'Desaprobado' : 'Aprobado' });
        loadTestimonials();
      }
    } catch {
      toast({ title: 'Error', description: 'Error al cambiar estado', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este testimonio?')) return;

    try {
      const response = await fetch(`/api/testimonials/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: 'Eliminado', description: 'Testimonio eliminado correctamente' });
        loadTestimonials();
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestión de Testimonios</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{testimonials.length} testimonios ({testimonials.filter(t => t.aprobado).length} aprobados)</p>
          </div>
          <Button onClick={openCreateForm} className="gap-2" data-testid="button-create-testimonial">
            <Plus className="w-4 h-4" /> Nuevo Testimonio
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
            <Card className="w-full max-w-2xl my-8 bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>{editingId ? 'Editar Testimonio' : 'Nuevo Testimonio'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={closeForm}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Autor *</label>
                      <Input value={form.autor} onChange={e => setForm(prev => ({ ...prev, autor: e.target.value }))} required data-testid="input-testimonial-autor" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Rol</label>
                      <Input value={form.rol} onChange={e => setForm(prev => ({ ...prev, rol: e.target.value }))} placeholder="ej: Inversor, Familia joven" data-testid="input-testimonial-rol" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Contenido *</label>
                    <Textarea value={form.contenido} onChange={e => setForm(prev => ({ ...prev, contenido: e.target.value }))} required rows={4} data-testid="textarea-testimonial-contenido" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="aprobado"
                      checked={form.aprobado}
                      onChange={e => setForm(prev => ({ ...prev, aprobado: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300"
                      data-testid="checkbox-testimonial-aprobado"
                    />
                    <label htmlFor="aprobado" className="text-sm text-slate-700 dark:text-slate-300">Aprobado (visible públicamente)</label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Imagen</label>
                    {form.existingImagen && (
                      <div className="mb-2">
                        <img src={form.existingImagen} alt="Testimonio" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">{newImagen ? newImagen.name : 'Subir imagen'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setNewImagen(e.target.files?.[0] || null)} data-testid="input-file-testimonial-imagen" />
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting} data-testid="button-submit-testimonial">
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingId ? 'Guardar cambios' : 'Crear testimonio'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className={!testimonial.aprobado ? 'opacity-60' : ''} data-testid={`card-admin-testimonial-${testimonial.id}`}>
              <CardContent className="flex items-center gap-4 p-4">
                {testimonial.imagen && (
                  <img src={testimonial.imagen} alt={testimonial.autor} className="w-16 h-16 object-cover rounded-full" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.autor}</h3>
                    {testimonial.aprobado ? (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs">Aprobado</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs">Pendiente</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.rol}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 truncate mt-1">"{testimonial.contenido}"</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleToggleApproval(testimonial)} title={testimonial.aprobado ? 'Desaprobar' : 'Aprobar'} data-testid={`button-toggle-testimonial-${testimonial.id}`}>
                    {testimonial.aprobado ? <XCircle className="w-4 h-4 text-amber-500" /> : <Check className="w-4 h-4 text-emerald-500" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(testimonial)} data-testid={`button-edit-testimonial-${testimonial.id}`}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)} data-testid={`button-delete-testimonial-${testimonial.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {testimonials.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No hay testimonios. Crea el primero.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
