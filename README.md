# FacturaDirecta CSV Exporter

Herramienta para exportar clientes y proveedores desde MySQL al formato CSV de FacturaDirecta.

## 📋 Requisitos

- Node.js 18+ (LTS)
- MySQL 5.7+ o MariaDB 10.3+
- npm o yarn

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
```

3. **Configurar tu base de datos:**

Edita el archivo `src/services/clientService.js` y ajusta la consulta SQL según tu esquema de base de datos.

### Ejemplo de esquema de tabla:

```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nif VARCHAR(20),
  nombre VARCHAR(255),
  apellidos VARCHAR(255),
  nombre_comercial VARCHAR(255),
  codigo_cliente VARCHAR(50),
  no_acepta_facturas_electronicas BOOLEAN DEFAULT FALSE,
  direccion_1 VARCHAR(255),
  direccion_2 VARCHAR(255),
  localidad VARCHAR(100),
  provincia VARCHAR(100),
  codigo_postal VARCHAR(10),
  pais VARCHAR(2) DEFAULT 'ES',
  web VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(20),
  movil VARCHAR(20),
  idioma VARCHAR(2) DEFAULT 'es',
  banco_pais VARCHAR(2),
  banco_numero_cuenta VARCHAR(50),
  banco_swift_bic VARCHAR(20),
  notas TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📖 Uso

### Exportar clientes:

```bash
npm start
```

### Exportar proveedores:

```bash
npm run suppliers
```

### Modo desarrollo (con auto-reload):

**Para clientes:**
```bash
npm run dev
```

**Para proveedores:**
```bash
npm run suppliers:dev
```

## 📁 Estructura del Proyecto

```
Import/
├── src/
│   ├── database/
│   │   └── connection.js          # Gestión de conexión MySQL
│   ├── services/
│   │   ├── clientService.js       # Consultas de clientes
│   │   ├── supplierService.js     # Consultas de proveedores
│   │   └── csvService.js          # Generación de archivos CSV
│   ├── utils/
│   │   └── csvMapper.js           # Mapeo de datos al formato FacturaDirecta
│   ├── index.js                   # Exportador de clientes
│   └── indexSuppliers.js          # Exportador de proveedores
├── config/
│   └── database.config.js         # Configuración de BD y CSV
├── output/                        # CSVs generados (creado automáticamente)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuración

### Variables de entorno (.env):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos

# CSV Output Configuration
OUTPUT_DIR=./output
CSV_FILENAME=clientes_facturadirecta.csv
```

## 📊 Formato del CSV

El CSV generado incluye los siguientes campos según el formato de FacturaDirecta:

- Cliente - NIF
- Cliente - Nombre
- Cliente - Apellidos
- Cliente - Nombre comercial
- Cliente - Código cliente
- Cliente - No acepta facturas electrónicas
- Cliente - Dirección 1
- Cliente - Dirección 2
- Cliente - Localidad
- Cliente - Provincia
- Cliente - Código postal
- Cliente - País
- Cliente - Web
- Cliente - Email
- Cliente - Teléfono
- Cliente - Móvil
- Cliente - Idioma
- Cliente - Banco - País
- Cliente - Banco - Número cuenta
- Cliente - Banco - SWIFT/BIC
- Cliente - Notas

## 🎯 Características

✅ Conexión segura a MySQL con pool de conexiones  
✅ Mapeo automático de campos al formato FacturaDirecta  
✅ Validación de datos antes de exportar  
✅ Encoding UTF-8 para caracteres especiales  
✅ Nombres de archivo con timestamp  
✅ Manejo de errores robusto  
✅ Logs informativos del proceso  

## 🔍 Personalización

### Modificar la consulta SQL:

Edita `src/services/clientService.js` para ajustar la consulta según tu esquema:

```javascript
const query = `
  SELECT 
    nif,
    nombre,
    // ... tus campos
  FROM tu_tabla_clientes
  WHERE tus_condiciones
`;
```

### Modificar el mapeo de campos:

Edita `src/utils/csvMapper.js` para ajustar cómo se mapean los campos de tu BD al formato FacturaDirecta.

## 📝 Notas Importantes

1. **Encoding**: El CSV se genera con UTF-8 para soportar caracteres especiales (ñ, tildes, etc.)
2. **Comillas**: Todos los campos se entrecomillan automáticamente para manejar comas en el contenido
3. **Timestamp**: Cada archivo generado incluye un timestamp para evitar sobrescrituras
4. **Validación**: Se validan campos obligatorios antes de generar el CSV

## 🐛 Solución de Problemas

### Error de conexión a la base de datos:
- Verifica las credenciales en el archivo `.env`
- Asegúrate de que MySQL esté corriendo
- Verifica que el usuario tenga permisos de lectura

### No se generan registros:
- Revisa la consulta SQL en `clientService.js`
- Verifica que existan datos en tu tabla
- Comprueba los filtros de la consulta (ej: `WHERE activo = 1`)

### Caracteres especiales mal codificados:
- El archivo ya usa UTF-8, pero asegúrate de que FacturaDirecta lo importe con UTF-8

## 📄 Licencia

MIT

## 👤 Autor

Santiago Tirado
