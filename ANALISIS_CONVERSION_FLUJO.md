# Análisis Técnico: Flujo de Conversión - Cuestionario Gratis y Agendamiento

**Fecha de Análisis:** 2026-01-24  
**Objetivo:** Documentar el flujo actual de captura de leads y agendamiento para refactorización hacia experiencia "One-Click" con captura temprana de emails.

---

## 1. Estructura de Componentes

### 1.1 Componentes del Cuestionario Gratis (Quiz)

#### `src/components/QuizModal.tsx`
**Responsabilidad:** Modal principal que contiene todo el flujo del cuestionario interactivo.

**Estado Local:**
- `currentStep`: Controla qué paso del quiz se muestra (-1 = paso cero/intro, 0-2 = preguntas, 3 = ingresos, 4 = hijos, 5 = email, 6 = resultado)
- `answers`: Objeto que almacena las respuestas del usuario (`Record<string, string>`)
- `email`: Email capturado en el paso 5
- `showResult`: Boolean que controla si se muestra el resultado final
- `recommendation`: Objeto con el plan recomendado (plan, title, reason, discount, features)
- `isLoading`: Estado de carga durante el guardado del lead
- `monthlyIncome`, `selectedIncomeLabel`, `numberOfChildren`, `selectedChildrenLabel`, `calculatedRange`: Estados para el calculador de pensión

**Props:**
```typescript
interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Flujo de Pasos:**
- **Paso -1:** Pantalla de bienvenida ("Sabemos que este es un momento difícil")
- **Paso 0-2:** Tres preguntas principales del quiz
- **Paso 3:** Selección de rango de ingresos (condicional, solo si `shouldShowCalculator()` retorna true)
- **Paso 4:** Selección de número de hijos (condicional)
- **Paso 5:** Captura de email
- **Paso 6:** Muestra resultado con recomendación y botón CTA a `/agendamiento?plan=general`

**Funciones Clave:**
- `handleAnswer(value: string)`: Maneja la selección de respuesta y avanza automáticamente al siguiente paso después de 200ms
- `handleEmailSubmit(e: React.FormEvent)`: Valida email, guarda lead en Supabase (`leads_quiz`), muestra resultado
- `persistLead()`: Función async que inserta el lead en la tabla `leads_quiz`
- `getRecommendation(answersMap)`: Lógica de negocio que determina qué plan recomendar basado en las respuestas

**Persistencia de Leads:**
- **Éxito:** Inserta directamente en `supabase.from('leads_quiz').insert([quizData])`
- **Fallback:** Si falla, guarda en `localStorage` bajo la clave `pendingQuizLeads` y hay un `useEffect` que intenta reenviar estos leads pendientes al montar el componente

---

#### `src/pages/ServicioFamiliaPage.tsx`
**Responsabilidad:** Página de landing del servicio Familia que contiene el botón que abre el QuizModal.

**Estado Local:**
- `showQuiz`: Boolean que controla si el QuizModal está abierto (`useState(false)`)

**Ubicación del Botón:**
```tsx
// Línea ~468-469
<ToolCard
  ctaText="Empezar el Quiz Gratis"
  onClick={() => setShowQuiz(true)}
/>
```

**Renderizado del Modal:**
```tsx
// Línea ~863
<QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
```

**Problema Identificado (Mobile):**
El botón está dentro de un `ToolCard` que puede tener problemas de visibilidad/posicionamiento en móvil. No hay un botón flotante específico para móvil que garantice visibilidad.

---

### 1.2 Componentes del Agendamiento

#### `src/contexts/AgendamientoContext.tsx`
**Responsabilidad:** Contexto global que maneja todo el estado del flujo de agendamiento.

**Estado Global:**
- `step`: Paso actual del agendamiento (1 = info cliente, 2 = scheduling, 3 = pago)
- `selectedDate`, `selectedTime`, `selectedMeetingType`: Datos de la cita seleccionada
- `formData`: Objeto con todos los datos del formulario (nombre, email, telefono, rut, empresa, descripcion, codigoConvenio)
- `isLoading`, `error`: Estados de carga y errores
- `service`: Servicio seleccionado (obtenido de `serviceCatalog` basado en query param `plan`)
- `priceCalculation`: Objeto calculado con precios, descuentos, validaciones

**React Hook Form:**
El contexto usa `useForm<FormData>` de `react-hook-form` para manejo optimizado del formulario:
```typescript
const form = useForm<FormData>({
  mode: 'onChange', // Validación en tiempo real
  defaultValues: { ... }
});
```

**Funciones Clave:**
- `handleBookingAndPayment()`: Crea la reserva en Supabase (`reservas` table) y maneja el flujo de pago
- `goToPayment(freshTime?)`: Valida que fecha/hora estén completos y avanza al paso 3 (pago)
- `setFormData()`, `updateFormField()`: Helpers para actualizar campos del formulario
- `formatRUT()`: Utilidad para formatear RUT

**Persistencia:**
- La reserva se crea en `supabase.from('reservas').insert(reservaData)` a través de `createBookingWithRealEmail()` del servicio `supabaseBooking.ts`
- **NO se captura email temprano:** El email solo se pide en `Step1_ClientInfo` como parte del flujo normal de agendamiento

---

#### `src/components/agendamiento/steps/Step1_ClientInfo.tsx`
**Responsabilidad:** Primer paso del agendamiento donde se capturan los datos del cliente.

**Estructura:**
- Usa `fieldsConfig` array que define los campos en orden:
  1. `nombre` (requerido)
  2. `email` (requerido)
  3. `telefono` (requerido)
  4. `rut` (requerido)
  5. `empresa` (opcional)
  6. `codigoConvenio` (opcional)
  7. `descripcion` (opcional, textarea)

**Flujo de Campos:**
- Usa `currentField` state para mostrar un campo a la vez
- Cada campo tiene su propia pregunta personalizada (ej: "¡Un placer, {nombre}! ¿Cuál es tu correo electrónico?")
- Auto-avance: Cuando se completa un campo válido, automáticamente avanza al siguiente campo después de validación
- El email es el **segundo campo** (índice 1) después del nombre

**Validación:**
- Usa `validationRules` de `@/hooks/useFormValidation`
- Valida en tiempo real con `react-hook-form` (`mode: 'onChange'`)
- `handleAdvance()` valida el campo actual antes de avanzar

**Problema Identificado:**
- El email se captura **después** de que el usuario ya inició el proceso de agendamiento
- No hay captura temprana de email antes de mostrar el formulario completo
- El usuario debe completar nombre antes de llegar al email

---

#### `src/components/agendamiento/steps/Step2_Scheduling.tsx`
**Responsabilidad:** Segundo paso donde se selecciona fecha, hora y tipo de reunión.

**Flujo:**
- Primero selecciona día (`schedulingStep === 'day'`)
- Luego selecciona hora (`schedulingStep === 'time'`)
- También selecciona tipo de reunión (videollamada, telefonica, presencial)

**Avance Automático:**
- Al seleccionar una hora válida, llama `goToPayment()` automáticamente si `selectedDate`, `time`, y `selectedMeetingType` están todos presentes
- Si falta alguno, muestra error: "Por favor completa la selección de fecha y hora"

---

## 2. Flujo del Cuestionario (Puntos 1, 2 y 3)

### 2.1 Botón que Abre el Cuestionario

**Ubicación:** `src/pages/ServicioFamiliaPage.tsx` línea ~468-469

**Componente:**
```tsx
<ToolCard
  icon={Sparkles}
  title="Descubre tu Plan Ideal"
  description="¿No tienes claro por dónde empezar? Responde 3 preguntas..."
  ctaText="Empezar el Quiz Gratis"
  onClick={() => setShowQuiz(true)}
/>
```

**Problema en Móvil:**
- El `ToolCard` está dentro de un grid responsive que puede ocultarse o quedar fuera de vista en móvil
- No hay un botón flotante específico para móvil que garantice visibilidad constante
- El botón puede quedar "enterrado" en el scroll de la página

**Solución Necesaria:**
- Agregar un botón flotante visible en móvil (sticky bottom o fixed)
- O asegurar que el `ToolCard` siempre sea visible en la primera pantalla móvil

---

### 2.2 Estructura del Agente de Bienvenida

**Ubicación:** `src/components/QuizModal.tsx` líneas ~562-638

**Orden del Código:**
1. **Paso -1 (Paso Cero):** Pantalla de bienvenida emocional
   - Ícono grande con animación de latido (`Heart` icon)
   - Mensaje: "Sabemos que este es un momento difícil"
   - Lista de beneficios (3 bullets)
   - Botón CTA: "Comenzar mi diagnóstico" → `onClick={() => setCurrentStep(0)}`

2. **Paso 0-2:** Preguntas del quiz (renderizadas dinámicamente)
   - Cada pregunta muestra 3 opciones con iconos
   - Al hacer clic en una opción, se ejecuta `handleAnswer(value)` que:
     - Guarda la respuesta en `answers`
     - Avanza automáticamente al siguiente paso después de 200ms

3. **Pasos Condicionales (3-4):** Calculador de pensión (solo si `shouldShowCalculator()` retorna true)
   - Paso 3: Selección de rango de ingresos
   - Paso 4: Selección de número de hijos
   - Al completar, calcula rango y avanza al paso 5

4. **Paso 5:** Captura de email
   - Formulario con input de email
   - Botón de envío que ejecuta `handleEmailSubmit()`

5. **Paso 6:** Resultado final con recomendación

**Problema Identificado:**
- El "Agente de Bienvenida" (paso -1) es solo una pantalla estática con un botón
- No hay un componente separado de "asistente" que guíe al usuario
- El flujo es secuencial: una pregunta por pantalla

---

### 2.3 Manejo del Avance de Preguntas

**Ubicación:** `src/components/QuizModal.tsx` líneas ~209-240

**Función `handleAnswer`:**
```typescript
const handleAnswer = (value: string) => {
  const stepKey = currentStep.toString();
  const newAnswers = { ...answers, [stepKey]: value };
  delete newAnswers.calculatorIncome;
  delete newAnswers.calculatorChildren;
  setAnswers(newAnswers);
  
  if (currentStep < questions.length - 1) {
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
    }, 200);
  } else {
    // Última pregunta respondida
    setTimeout(() => {
      const shouldCalculate = shouldShowCalculator(newAnswers);
      // ... reset estados del calculador ...
      const result = getRecommendation(newAnswers);
      setRecommendation(result);

      if (shouldCalculate) {
        setCurrentStep(3); // Paso de ingresos
      } else {
        setCurrentStep(5); // Ir directo al email
      }
    }, 200);
  }
};
```

**Comportamiento Actual:**
- ✅ **Avanza automáticamente** al seleccionar una opción (no requiere clic en "Siguiente")
- ⏱️ Delay de 200ms antes de avanzar (para feedback visual)
- 🔄 Si es la última pregunta (índice 2), decide si mostrar calculador o ir directo al email

**Problema Identificado:**
- El diseño actual muestra **una pregunta por pantalla** (UI secuencial)
- No hay opción de ver todas las preguntas de una vez
- El usuario debe completar pregunta por pregunta sin poder ver el contexto completo

---

### 2.4 UI Actual vs. Solicitud de "Todo de Una Vez"

**UI Actual:**
- Modal con scroll interno
- Una pregunta visible a la vez (con animación de entrada/salida)
- Barra de progreso que muestra `((currentStep + 1) / questions.length) * 100%`
- Navegación: botón "Volver" disponible después del paso 0

**Solicitud de Refactorización:**
- Mostrar **todas las preguntas en una sola pantalla**
- Permitir al usuario responder en cualquier orden
- Capturar email **al inicio** (antes de mostrar preguntas)
- Experiencia "One-Click": botón final que redirige directamente a agendamiento con datos prellenados

**Cambios Necesarios:**
1. Cambiar `currentStep` de número a objeto que trackee qué preguntas están completas
2. Renderizar todas las preguntas en un solo scroll
3. Mover captura de email al inicio (antes del paso -1 o como primer campo)
4. Prellenar datos del agendamiento desde las respuestas del quiz

---

## 3. Captura del Lead (Punto 4)

### 3.1 Dónde se Pide el Correo Electrónico

#### En el Quiz:
**Ubicación:** `src/components/QuizModal.tsx` líneas ~840-918

**Paso 5 del Quiz:**
- Se muestra después de completar las 3 preguntas (y opcionalmente el calculador)
- Input de email con validación regex básica
- Formulario con `onSubmit={handleEmailSubmit}`

**Código:**
```tsx
{!showResult && currentStep === 5 && (
  <motion.div>
    <h3>¡Último paso! ¿A qué correo enviamos tu estrategia?</h3>
    <form onSubmit={handleEmailSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Escribe tu correo aquí"
        required
      />
      <button type="submit">Enviar</button>
    </form>
  </motion.div>
)}
```

**Problema:** El email se pide **al final** del flujo, después de que el usuario ya invirtió tiempo en responder preguntas.

---

#### En el Agendamiento:
**Ubicación:** `src/components/agendamiento/steps/Step1_ClientInfo.tsx` líneas ~81-89

**Campo 2 del Formulario:**
- Se pide después del nombre (campo 1)
- Parte del flujo normal de agendamiento
- Validación con `validationRules.email`

**Código:**
```tsx
{
  name: 'email',
  question: watchedValues.nombre
    ? `¡Un placer, ${watchedValues.nombre.split(' ')[0]}! ¿Cuál es tu correo electrónico?`
    : '¿Cuál es tu correo electrónico?',
  placeholder: 'juan@empresa.com',
  type: 'email',
  summaryLabel: 'Email',
  autoComplete: 'email',
  rules: validationRules.email,
}
```

**Problema:** El email se pide **después** de que el usuario ya inició el proceso de agendamiento y completó su nombre.

---

### 3.2 Momento Exacto de Guardado en Supabase

#### Leads del Quiz:
**Ubicación:** `src/components/QuizModal.tsx` líneas ~314-334

**Función `persistLead()`:**
```typescript
const persistLead = async () => {
  const quizData = {
    name: 'Quiz Inline Lead',
    email: email,
    quiz_answers: JSON.stringify(answers),
    plan_recommended: recommendation?.plan || 'Integral',
    income_range: selectedIncomeLabel,
    income_value: monthlyIncome,
    children_count: numberOfChildren,
    children_label: selectedChildrenLabel,
    calculated_min: calculatedRange?.min ?? null,
    calculated_max: calculatedRange?.max ?? null,
    status: 'nuevo'
  };

  const { error } = await supabase
    .from('leads_quiz')
    .insert([quizData]);

  if (error) throw error;
};
```

**Momento de Ejecución:**
- Se ejecuta dentro de `handleEmailSubmit()` después de validar el email
- **ANTES** de mostrar el resultado (`showRecommendationInstantly()` se llama primero, pero `persistLead()` se ejecuta después)
- Si falla, guarda en `localStorage` como fallback

**Tabla Supabase:** `leads_quiz`

---

#### Reservas del Agendamiento:
**Ubicación:** `src/contexts/AgendamientoContext.tsx` líneas ~104-248

**Función `handleBookingAndPayment()`:**
- Se ejecuta cuando el usuario completa el paso 3 (pago)
- Llama a `createBookingWithRealEmail(bookingData)` del servicio `supabaseBooking.ts`

**Servicio:** `src/services/supabaseBooking.ts` líneas ~98-151

**Función `createBookingWithRealEmail()`:**
```typescript
export const createBookingWithRealEmail = async (
  bookingData: BookingData
): Promise<{...}> => {
  // 1. Crear reserva en Supabase
  const reservaResult = await crearReserva(bookingData);
  
  // 2. Preparar datos para email (pero NO enviar aquí)
  // 3. Retornar resultado
};
```

**Función `crearReserva()`:** Líneas ~154-239
```typescript
export const crearReserva = async (bookingData: BookingData) => {
  const reservaData = {
    nombre: bookingData.cliente.nombre,
    email: bookingData.cliente.email,
    telefono: bookingData.cliente.telefono,
    rut: bookingData.cliente.rut || 'No especificado',
    servicio: bookingData.servicio.tipo,
    precio: bookingData.servicio.precio,
    tipo_reunion: bookingData.servicio.tipoReunion || null,
    fecha: bookingData.servicio.fecha,
    hora: bookingData.servicio.hora,
    descripcion: bookingData.descripcion || 'Consulta legal',
    estado: 'pendiente' as const
  };

  const { data: reserva, error } = await supabase
    .from('reservas')
    .insert(reservaData)
    .select()
    .single();
  
  // Actualizar external_reference = id
  // ...
};
```

**Tabla Supabase:** `reservas`

**Momento de Ejecución:**
- Se ejecuta **al final** del flujo, cuando el usuario ya completó:
  1. Datos del cliente (incluyendo email)
  2. Fecha y hora
  3. Confirmación de pago

---

### 3.3 Estructura de Tablas Supabase

#### Tabla `leads_quiz`:
**Ubicación del Schema:** `src/integrations/supabase/types.ts` líneas ~95-127

```typescript
leads_quiz: {
  Row: {
    created_at: string | null
    email: string                    // REQUERIDO
    id: string
    name: string                     // REQUERIDO
    plan_recommended: string | null
    quiz_answers: Json               // REQUERIDO (JSON stringificado)
    status: string | null
    updated_at: string | null
    // Campos adicionales usados en persistLead():
    income_range?: string | null
    income_value?: number | null
    children_count?: number | null
    children_label?: string | null
    calculated_min?: string | null
    calculated_max?: string | null
  }
}
```

**Insert Esperado:**
```typescript
{
  name: 'Quiz Inline Lead',
  email: 'usuario@ejemplo.com',
  quiz_answers: '{"0":"mutual","1":"time","2":"budget"}',
  plan_recommended: 'Integral',
  status: 'nuevo',
  // ... campos opcionales del calculador
}
```

---

#### Tabla `reservas`:
**Ubicación del Schema:** `src/integrations/supabase/types.ts` líneas ~164+

```typescript
reservas: {
  Row: {
    created_at: string | null
    email: string
    nombre: string
    telefono: string
    rut: string
    servicio: string
    precio: string
    tipo_reunion: string | null
    fecha: string
    hora: string
    descripcion: string
    estado: string
    external_reference: string | null
    // ... otros campos
  }
}
```

**Insert Esperado:**
```typescript
{
  nombre: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  telefono: '+56 9 1234 5678',
  rut: '12345678-9',
  servicio: 'Consulta Estratégica con Abogado',
  precio: '35000',
  tipo_reunion: 'videollamada',
  fecha: '2026-01-25',
  hora: '10:00',
  descripcion: 'Consulta sobre divorcio',
  estado: 'pendiente'
}
```

---

## 4. Estado Global / Contexto

### 4.1 AgendamientoContext

**Ubicación:** `src/contexts/AgendamientoContext.tsx`

**Estado del Cliente:**
El contexto maneja el estado del cliente a través de `react-hook-form`:

```typescript
const form = useForm<FormData>({
  mode: 'onChange',
  defaultValues: {
    nombre: '',
    email: '',
    telefono: '',
    rut: '',
    empresa: '',
    descripcion: '',
    codigoConvenio: ''
  }
});

const formData = form.watch(); // Sincronizado automáticamente
```

**Progreso del Flujo:**
- `step`: Controla qué paso se muestra (1, 2, 3)
- `selectedDate`, `selectedTime`, `selectedMeetingType`: Datos de la cita
- `isLoading`, `error`: Estados de carga y errores

**Funciones de Actualización:**
- `setFormData(data)`: Actualiza múltiples campos a la vez
- `updateFormField(field, value)`: Actualiza un campo específico
- `setStep(step)`: Cambia el paso actual

**Problema Identificado:**
- **NO hay integración entre Quiz y Agendamiento:** Los datos del quiz no se pasan al contexto de agendamiento
- El email capturado en el quiz **NO se prellena** en el formulario de agendamiento
- El usuario debe volver a ingresar su email cuando llega a `/agendamiento?plan=general`

---

### 4.2 Estado del QuizModal

**Estado Local (No Compartido):**
- `answers`: Respuestas del quiz
- `email`: Email capturado
- `recommendation`: Plan recomendado

**Problema:**
- El estado del quiz es **completamente independiente** del estado de agendamiento
- No hay forma de pasar datos del quiz al agendamiento excepto a través de query params o localStorage

---

## 5. Recomendaciones para Refactorización

### 5.1 Captura Temprana de Email

**Cambio Necesario:**
1. Agregar un campo de email **antes** del paso -1 del quiz (pantalla de bienvenida)
2. O mover el paso 5 (email) al inicio del flujo
3. Guardar el email en `localStorage` o en un contexto compartido inmediatamente después de capturarlo

**Implementación Sugerida:**
```typescript
// Nuevo paso -2: Solo email
{currentStep === -2 && (
  <EmailCaptureStep 
    onEmailCaptured={(email) => {
      setEmail(email);
      // Guardar en localStorage inmediatamente
      localStorage.setItem('quiz_email', email);
      // Avanzar al paso -1 (bienvenida)
      setCurrentStep(-1);
    }}
  />
)}
```

---

### 5.2 Experiencia "One-Click"

**Cambio Necesario:**
1. Mostrar todas las preguntas en una sola pantalla (scroll vertical)
2. Permitir responder en cualquier orden
3. Botón final "Ver mi Recomendación" que:
   - Valida que todas las preguntas estén respondidas
   - Calcula la recomendación
   - Redirige a `/agendamiento?plan=general&email={email}&quiz={answers}`

**Implementación Sugerida:**
```typescript
// Cambiar currentStep de número a objeto
const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, string>>({});

// Renderizar todas las preguntas
{questions.map((q, idx) => (
  <QuestionCard
    key={q.id}
    question={q}
    selectedValue={answeredQuestions[q.id]}
    onSelect={(value) => {
      setAnsweredQuestions({ ...answeredQuestions, [q.id]: value });
    }}
  />
))}

// Botón final
<button
  onClick={() => {
    if (Object.keys(answeredQuestions).length === questions.length) {
      const recommendation = getRecommendation(answeredQuestions);
      // Redirigir con datos prellenados
      navigate(`/agendamiento?plan=general&email=${email}&quiz=${encodeURIComponent(JSON.stringify(answeredQuestions))}`);
    }
  }}
>
  Ver mi Recomendación
</button>
```

---

### 5.3 Integración Quiz → Agendamiento

**Cambio Necesario:**
1. Crear un contexto compartido o usar `localStorage` para pasar datos del quiz al agendamiento
2. En `Step1_ClientInfo`, prellenar el email si viene de query params o localStorage
3. Prellenar otros campos si están disponibles (nombre si se capturó en el quiz)

**Implementación Sugerida:**
```typescript
// En Step1_ClientInfo.tsx
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromQuiz = urlParams.get('email') || localStorage.getItem('quiz_email');
  const quizAnswers = urlParams.get('quiz');
  
  if (emailFromQuiz) {
    form.setValue('email', emailFromQuiz);
  }
  
  if (quizAnswers) {
    const answers = JSON.parse(decodeURIComponent(quizAnswers));
    // Usar respuestas para personalizar el formulario
  }
}, []);
```

---

### 5.4 Botón Móvil Visible

**Cambio Necesario:**
Agregar un botón flotante sticky en móvil que siempre esté visible:

```tsx
// En ServicioFamiliaPage.tsx
<div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
  <button
    onClick={() => setShowQuiz(true)}
    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold shadow-xl"
  >
    Empezar Quiz Gratis
  </button>
</div>
```

---

## 6. Resumen de Problemas Críticos

1. ❌ **Email se captura al final del quiz** → Debe capturarse al inicio
2. ❌ **Email se captura después del nombre en agendamiento** → Debe ser el primer campo
3. ❌ **No hay integración entre quiz y agendamiento** → Los datos no se pasan
4. ❌ **Una pregunta por pantalla** → Debe mostrar todas las preguntas de una vez
5. ❌ **Botón del quiz puede no ser visible en móvil** → Necesita botón flotante
6. ❌ **No hay experiencia "One-Click"** → El usuario debe hacer múltiples clics y reingresar datos

---

## 7. Archivos Clave para Refactorización

1. `src/components/QuizModal.tsx` - Refactorizar flujo de pasos y captura de email
2. `src/pages/ServicioFamiliaPage.tsx` - Agregar botón móvil flotante
3. `src/contexts/AgendamientoContext.tsx` - Agregar lógica para prellenar desde quiz
4. `src/components/agendamiento/steps/Step1_ClientInfo.tsx` - Prellenar email desde query params/localStorage
5. `src/services/supabaseBooking.ts` - Verificar que la estructura de datos soporte datos del quiz

---

**Fin del Análisis**
