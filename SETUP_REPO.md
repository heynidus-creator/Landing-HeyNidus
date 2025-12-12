# Setup: Preparar el repo para actualización grande

## ✅ ESTRUCTURA ACTUAL VERIFICADA

```
Raíz (package.json del proyecto)
├── client/                    # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── pages/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── index.css
│   ├── index.html
│   └── public/
├── server/                    # Backend Express + TypeScript
│   ├── index-dev.ts
│   ├── index-prod.ts
│   ├── app.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/                    # Código compartido
├── package.json              # Scripts principales
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## 📋 CHECKLIST PRE-ACTUALIZACIÓN

### 1️⃣ Verificar Git y crear rama feature

```bash
# Ver estado actual
git status

# Ver ramas actuales
git branch -a

# Crear rama nueva (TÚ lo haces, yo NO tengo permisos)
git checkout -b feature/admin-panel

# Verify:
git branch -a       # Debes ver: * feature/admin-panel
```

### 2️⃣ Verificar que el proyecto corre en DEV

```bash
# En la terminal/workflows:
npm run dev

# Debes VER en consola:
# ✅ "10:xx:xx PM [express] serving on port 5000"
# ✅ "VITE vX.X.X ready in XXX ms"
# ✅ En el navegador: HeyNidus carga, navbar funciona
```

### 3️⃣ Verificar que build funciona

```bash
# Compilar TypeScript
npm run check

# Debes VER: sin errores (salvo warnings OK)

# Build frontend + backend
npm run build

# Debes VER:
# ✅ "dist/" carpeta creada
# ✅ "dist/client/" con HTML/JS
# ✅ Archivo de salida compilado
```

### 4️⃣ Verificar producción (opcional)

```bash
npm start

# Debes VER:
# ✅ "10:xx:xx PM [express] serving on port 5000"
# ✅ Sitio cargable en navegador
# ✅ SIN hot-reload (producción)
```

---

## 🔧 SCRIPTS PRINCIPALES

| Comando | Qué hace | Cuándo |
|---------|----------|--------|
| `npm run dev` | Inicia dev (Express + Vite HMR) | Desarrollo |
| `npm run build` | Build producción (Vite) | Antes de deploy |
| `npm start` | Run producción (desde dist/) | Testing |
| `npm run check` | Verifica TypeScript | Antes de commit |
| `npm run db:push` | Migra esquema DB (Drizzle) | Si cambias schema |

---

## 📊 SEÑALES DE OK

### ✅ DEV Mode - Qué deberías ver:

```
10:20:52 PM [express] serving on port 5000

VITE vX.X.X  ready in XXX ms

Browser:
- HeyNidus en navbar
- Todos los links funcionan
- Dark mode toggle funciona
- Hot reload = editar archivo → cambio instantáneo
```

### ✅ BUILD - Qué deberías ver:

```
✓ built in XXXms

dist/
  ├── public/
  │   ├── index.html
  │   ├── client/
  │   │   ├── index-XXXXX.js
  │   │   └── index-XXXXX.css
  │   └── ...
```

### ✅ Rama Git - Qué deberías ver:

```bash
$ git branch -a
  main
* feature/admin-panel        ← Estás acá
  
$ git log --oneline
abcd123 Latest commit
...
```

---

## ⚠️ ANTES DE EMPEZAR CAMBIOS

1. **Estás en rama `feature/admin-panel`**?
   ```bash
   git branch  # Debe mostrar: * feature/admin-panel
   ```

2. **`npm run dev` corre sin errores**?
   ```bash
   npm run dev  # ✅ Navega a http://localhost:5000
   ```

3. **`npm run check` pasa**?
   ```bash
   npm run check  # ✅ Sin errores TypeScript
   ```

Si los 3 ✅, estás listo para cambios grandes sin romper nada.

---

## 🚨 SI ALGO ROMPE

### Error en build:
```bash
npm run check          # Ver qué error de TypeScript
# O mira en el navegador → Console tab
```

### Error en dev:
```bash
# Mira terminal y navegador console
# Si no sabes qué pasó → `git diff` para ver cambios
```

### Deshacer cambios:
```bash
git status              # Ver qué cambió
git restore [file]     # Deshacer archivo específico
git checkout main      # Volver a main (pierde feature/)
```

---

## 📝 NOTAS FINALES

- **package.json**: Define qué versión de dependencias usamos (NO modificar sin consultar)
- **vite.config.ts**: Config frontend (NO modificar)
- **server/app.ts**: Setup Express base (cambios acá afectan TODO)
- **Cambios seguros**: Agregar componentes en `client/src/components/`, rutas en `server/routes.ts`

---

## ✨ PRÓXIMO PASO:

1. Crea rama `feature/admin-panel` (tú, en terminal)
2. Run `npm run dev` y verifica que TODO funciona
3. Run `npm run check` (sin errores)
4. Decime qué código querés integrar
5. Yo lo adapto sin romper nada

¡Listo para actualización! 🚀
