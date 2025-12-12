import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Loader2 } from 'lucide-react';
import type { Project } from '@shared/schema';

type ProjectForm = Omit<Project, 'id' | 'updatedAt' | 'masterPlanFiles' | 'imagenes' | 'videos'> & {
  existingMasterPlanFiles: string[];
  existingImagenes: string[];
  existingVideos: string[];
};

const emptyForm: ProjectForm = {
  nombre: '',
  tipo: 'Proyecto de terceros',
  etapa: 'Preventa',
  ubicacionTexto: '',
  descripcion: '',
  contenidoLargo: '',
  maps: { lat: undefined, lng: undefined, placeUrl: '' },
  linkLotes: '',
  caracteristicas: [],
  servicios: [],
  amenidades: [],
  superficie: '',
  lotes: '',
  existingMasterPlanFiles: [],
  existingImagenes: [],
  existingVideos: [],
};

export default function ProjectsAdmin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [newMasterPlan, setNewMasterPlan] = useState<FileList | null>(null);
  const [newImagenes, setNewImagenes] = useState<FileList | null>(null);
  const [newVideos, setNewVideos] = useState<FileList | null>(null);
  const [caracteristicasText, setCaracteristicasText] = useState('');
  const [serviciosText, setServiciosText] = useState('');
  const [amenidadesText, setAmenidadesText] = useState('');

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
      loadProjects();
    } catch {
      navigate('/admin');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects/list');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Error al cargar proyectos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setCaracteristicasText('');
    setServiciosText('');
    setAmenidadesText('');
    setNewMasterPlan(null);
    setNewImagenes(null);
    setNewVideos(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (project: Project) => {
    setForm({
      nombre: project.nombre,
      tipo: project.tipo,
      etapa: project.etapa,
      ubicacionTexto: project.ubicacionTexto,
      descripcion: project.descripcion,
      contenidoLargo: project.contenidoLargo,
      maps: project.maps || {},
      linkLotes: project.linkLotes,
      caracteristicas: project.caracteristicas,
      servicios: project.servicios,
      amenidades: project.amenidades,
      superficie: project.superficie,
      lotes: project.lotes,
      existingMasterPlanFiles: project.masterPlanFiles,
      existingImagenes: project.imagenes,
      existingVideos: project.videos,
    });
    setCaracteristicasText(project.caracteristicas.join('\n'));
    setServiciosText(project.servicios.join('\n'));
    setAmenidadesText(project.amenidades.join('\n'));
    setNewMasterPlan(null);
    setNewImagenes(null);
    setNewVideos(null);
    setEditingId(project.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const removeExistingFile = (type: 'masterPlan' | 'imagenes' | 'videos', filePath: string) => {
    if (type === 'masterPlan') {
      setForm(prev => ({ ...prev, existingMasterPlanFiles: prev.existingMasterPlanFiles.filter(f => f !== filePath) }));
    } else if (type === 'imagenes') {
      setForm(prev => ({ ...prev, existingImagenes: prev.existingImagenes.filter(f => f !== filePath) }));
    } else {
      setForm(prev => ({ ...prev, existingVideos: prev.existingVideos.filter(f => f !== filePath) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('tipo', form.tipo);
      formData.append('etapa', form.etapa);
      formData.append('ubicacionTexto', form.ubicacionTexto);
      formData.append('descripcion', form.descripcion);
      formData.append('contenidoLargo', form.contenidoLargo);
      formData.append('maps', JSON.stringify({
        lat: form.maps.lat || undefined,
        lng: form.maps.lng || undefined,
        placeUrl: form.maps.placeUrl || '',
      }));
      formData.append('linkLotes', form.linkLotes);
      formData.append('caracteristicas', JSON.stringify(caracteristicasText.split('\n').filter(Boolean)));
      formData.append('servicios', JSON.stringify(serviciosText.split('\n').filter(Boolean)));
      formData.append('amenidades', JSON.stringify(amenidadesText.split('\n').filter(Boolean)));
      formData.append('superficie', form.superficie);
      formData.append('lotes', form.lotes);

      if (editingId) {
        formData.append('existingMasterPlanFiles', JSON.stringify(form.existingMasterPlanFiles));
        formData.append('existingImagenes', JSON.stringify(form.existingImagenes));
        formData.append('existingVideos', JSON.stringify(form.existingVideos));
      }

      if (newMasterPlan) {
        Array.from(newMasterPlan).forEach(file => formData.append('masterPlanFiles', file));
      }
      if (newImagenes) {
        Array.from(newImagenes).forEach(file => formData.append('imagenes', file));
      }
      if (newVideos) {
        Array.from(newVideos).forEach(file => formData.append('videos', file));
      }

      const url = editingId ? `/api/projects/update/${editingId}` : '/api/projects/create';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: 'Guardado', description: editingId ? 'Proyecto actualizado' : 'Proyecto creado' });
        closeForm();
        loadProjects();
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
    if (!confirm('¿Seguro que quieres eliminar este proyecto?')) return;

    try {
      const response = await fetch(`/api/projects/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({ title: 'Eliminado', description: 'Proyecto eliminado correctamente' });
        loadProjects();
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} data-testid="button-back-admin">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestión de Proyectos</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{projects.length} proyectos</p>
          </div>
          <Button onClick={openCreateForm} className="gap-2" data-testid="button-create-project">
            <Plus className="w-4 h-4" /> Nuevo Proyecto
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
            <Card className="w-full max-w-4xl my-8 bg-white dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={closeForm}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Nombre *</label>
                      <Input value={form.nombre} onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))} required data-testid="input-project-nombre" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Tipo</label>
                      <select value={form.tipo} onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))} className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" data-testid="select-project-tipo">
                        <option value="Proyecto propio">Proyecto propio</option>
                        <option value="Proyecto de terceros">Proyecto de terceros</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Etapa *</label>
                      <select value={form.etapa} onChange={e => setForm(prev => ({ ...prev, etapa: e.target.value }))} className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100" data-testid="select-project-etapa">
                        <option value="Preventa">Preventa</option>
                        <option value="En venta">En venta</option>
                        <option value="Próximamente">Próximamente</option>
                        <option value="Vendido">Vendido</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Ubicación *</label>
                      <Input value={form.ubicacionTexto} onChange={e => setForm(prev => ({ ...prev, ubicacionTexto: e.target.value }))} required data-testid="input-project-ubicacion" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Superficie</label>
                      <Input value={form.superficie} onChange={e => setForm(prev => ({ ...prev, superficie: e.target.value }))} placeholder="ej: 63.000 m²" data-testid="input-project-superficie" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Lotes</label>
                      <Input value={form.lotes} onChange={e => setForm(prev => ({ ...prev, lotes: e.target.value }))} placeholder="ej: 30 lotes en preventa" data-testid="input-project-lotes" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Descripción corta *</label>
                    <Textarea value={form.descripcion} onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))} required rows={2} data-testid="textarea-project-descripcion" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Contenido largo</label>
                    <Textarea value={form.contenidoLargo} onChange={e => setForm(prev => ({ ...prev, contenidoLargo: e.target.value }))} rows={4} data-testid="textarea-project-contenidolargo" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Latitud</label>
                      <Input type="number" step="any" value={form.maps.lat ?? ''} onChange={e => setForm(prev => ({ ...prev, maps: { ...prev.maps, lat: e.target.value ? parseFloat(e.target.value) : undefined } }))} placeholder="-34.6857" data-testid="input-project-lat" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Longitud</label>
                      <Input type="number" step="any" value={form.maps.lng ?? ''} onChange={e => setForm(prev => ({ ...prev, maps: { ...prev.maps, lng: e.target.value ? parseFloat(e.target.value) : undefined } }))} placeholder="-58.7275" data-testid="input-project-lng" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">URL Google Maps</label>
                      <Input value={form.maps.placeUrl ?? ''} onChange={e => setForm(prev => ({ ...prev, maps: { ...prev.maps, placeUrl: e.target.value } }))} placeholder="https://maps.google.com/..." data-testid="input-project-placeurl" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Link de lotes disponibles</label>
                    <Input value={form.linkLotes} onChange={e => setForm(prev => ({ ...prev, linkLotes: e.target.value }))} placeholder="https://..." data-testid="input-project-linklotes" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Características (una por línea)</label>
                      <Textarea value={caracteristicasText} onChange={e => setCaracteristicasText(e.target.value)} rows={4} data-testid="textarea-project-caracteristicas" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Servicios (uno por línea)</label>
                      <Textarea value={serviciosText} onChange={e => setServiciosText(e.target.value)} rows={4} data-testid="textarea-project-servicios" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Amenidades (una por línea)</label>
                      <Textarea value={amenidadesText} onChange={e => setAmenidadesText(e.target.value)} rows={4} data-testid="textarea-project-amenidades" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Master Plan</label>
                      {form.existingMasterPlanFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.existingMasterPlanFiles.map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img src={file} alt="Master plan" className="w-16 h-16 object-cover rounded border" />
                              <button type="button" onClick={() => removeExistingFile('masterPlan', file)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{newMasterPlan ? `${newMasterPlan.length} archivos` : 'Subir imágenes'}</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => setNewMasterPlan(e.target.files)} data-testid="input-file-masterplan" />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Galería de imágenes</label>
                      {form.existingImagenes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.existingImagenes.map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img src={file} alt="Galería" className="w-16 h-16 object-cover rounded border" />
                              <button type="button" onClick={() => removeExistingFile('imagenes', file)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{newImagenes ? `${newImagenes.length} archivos` : 'Subir imágenes'}</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => setNewImagenes(e.target.files)} data-testid="input-file-imagenes" />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Videos</label>
                      {form.existingVideos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.existingVideos.map((file, idx) => (
                            <div key={idx} className="relative bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                              {file.split('/').pop()}
                              <button type="button" onClick={() => removeExistingFile('videos', file)} className="ml-2 text-red-500">
                                <X className="w-3 h-3 inline" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{newVideos ? `${newVideos.length} archivos` : 'Subir videos'}</span>
                        <input type="file" accept="video/*" multiple className="hidden" onChange={e => setNewVideos(e.target.files)} data-testid="input-file-videos" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={closeForm} disabled={isSubmitting}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting} data-testid="button-submit-project">
                      {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingId ? 'Guardar cambios' : 'Crear proyecto'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4">
          {projects.map(project => (
            <Card key={project.id} data-testid={`card-admin-project-${project.id}`}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">{project.nombre}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>{project.ubicacionTexto}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs">{project.etapa}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(project)} data-testid={`button-edit-project-${project.id}`}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} data-testid={`button-delete-project-${project.id}`}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No hay proyectos. Crea el primero.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
