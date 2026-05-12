// Toolkit teórico del taller. Datos consultados por el modal flotante.
window.TOOLKIT_DATA = {
  categories: [
    { id: 'smells',     name: 'Code Smells',     desc: 'Síntomas de problemas más profundos' },
    { id: 'solid',      name: 'SOLID',           desc: '5 principios de diseño OO' },
    { id: 'poo',        name: 'POO',             desc: 'Pilares de orientación a objetos' },
    { id: 'principles', name: 'Otros principios', desc: 'DRY, KISS, YAGNI, Tell Don\'t Ask…' },
  ],

  items: [
    // ============================================================
    // CODE SMELLS
    // ============================================================
    {
      id: 'rigidez', category: 'smells', name: 'Rigidez',
      short: 'Cambiar X obliga a cambiar Y, Z, W.',
      description: 'El sistema es difícil de modificar porque cada cambio se propaga a muchos lugares. Síntoma de acoplamiento alto.',
      howToFix: 'Aísla responsabilidades (SRP), introduce abstracciones (interfaces), usa inyección de dependencias para invertir el flujo de control.',
      examples: {
        javascript: `// Cambiar el cálculo del IVA toca 3 funciones
function precio(p) { return p * 1.16; }
function factura(p) { return \`Total: \${p * 1.16}\`; }
function envio(p) { return p * 1.16 + 50; }
// Fix: extrae IVA en una sola función`,
        python: `# Cambiar el IVA toca 3 funciones
def precio(p): return p * 1.16
def factura(p): return f"Total: {p * 1.16}"
def envio(p): return p * 1.16 + 50
# Fix: extrae IVA en una sola función`,
        cpp: `// Cambiar el IVA toca 3 funciones
double precio(double p) { return p * 1.16; }
std::string factura(double p) { return "Total: " + std::to_string(p * 1.16); }
double envio(double p) { return p * 1.16 + 50; }
// Fix: extrae IVA en una sola función`,
        kotlin: `// Cambiar el IVA toca 3 funciones
fun precio(p: Double) = p * 1.16
fun factura(p: Double) = "Total: \${p * 1.16}"
fun envio(p: Double) = p * 1.16 + 50
// Fix: extrae IVA en una sola función`,
        swift: `// Cambiar el IVA toca 3 funciones
func precio(_ p: Double) -> Double { p * 1.16 }
func factura(_ p: Double) -> String { "Total: \\(p * 1.16)" }
func envio(_ p: Double) -> Double { p * 1.16 + 50 }
// Fix: extrae IVA en una sola función`,
      },
    },
    {
      id: 'fragilidad', category: 'smells', name: 'Fragilidad',
      short: 'Un cambio rompe cosas no relacionadas.',
      description: 'El sistema se rompe en lugares inesperados cuando lo modificas. Suele venir de lógica copiada que no se actualiza en todos lados.',
      howToFix: 'Extract Method, eliminar duplicación, single source of truth, pruebas que cubran las ramificaciones.',
      examples: {
        javascript: `// Validación duplicada: cambiarla en una sin la otra rompe
function api1(e) { if (!e.includes('@')) throw 'bad'; ... }
function api2(e) { if (!/@/.test(e))     throw 'bad'; ... }
// Fix: const isEmail = (e) => /@/.test(e);`,
        python: `# Validación duplicada
def api1(e):
    if "@" not in e: raise ValueError("bad")
def api2(e):
    if not re.search(r"@", e): raise ValueError("bad")
# Fix: is_email = lambda e: "@" in e`,
        cpp: `// Validación duplicada en dos lugares
void api1(const std::string& e) { if (e.find('@')==std::string::npos) throw; }
void api2(const std::string& e) { if (!std::regex_search(e, RX)) throw; }
// Fix: bool isEmail(const std::string& e);`,
        kotlin: `// Validación duplicada
fun api1(e: String) { if (!e.contains("@")) error("bad") }
fun api2(e: String) { if (!Regex("@").containsMatchIn(e)) error("bad") }
// Fix: fun isEmail(e: String) = e.contains("@")`,
        swift: `// Validación duplicada
func api1(_ e: String) { if !e.contains("@") { fatalError() } }
func api2(_ e: String) { if e.range(of: "@") == nil { fatalError() } }
// Fix: func isEmail(_ e: String) -> Bool { e.contains("@") }`,
      },
    },
    {
      id: 'inmovilidad', category: 'smells', name: 'Inmovilidad',
      short: 'No puedes reusar un componente fuera.',
      description: 'Un módulo está tan acoplado a su contexto (DB, framework, archivos) que no puedes llevártelo a otro proyecto sin arrastrar todo lo demás.',
      howToFix: 'Dependency Injection. Recibe dependencias por parámetro/constructor en lugar de instanciarlas adentro.',
      examples: {
        javascript: `// No puedes reusar sin la DB real
function getUser(id) {
  const db = new MySQLConnection();   // hard-coded
  return db.query('SELECT * FROM users WHERE id=' + id);
}
// Fix: getUser(id, db) { return db.query(...); }`,
        python: `# No puedes reusar sin la DB real
def get_user(id):
    db = MySQLConnection()   # hard-coded
    return db.query(f"SELECT * FROM users WHERE id={id}")
# Fix: def get_user(id, db): ...`,
        cpp: `// Hard-coded; no se puede testear
User getUser(int id) {
  MySQLConnection db;          // hard-coded
  return db.query("SELECT * FROM users WHERE id=" + std::to_string(id));
}
// Fix: User getUser(int id, IDb& db);`,
        kotlin: `// Hard-coded
fun getUser(id: Int): User {
  val db = MySQLConnection()   // hard-coded
  return db.query("SELECT * FROM users WHERE id=$id")
}
// Fix: fun getUser(id: Int, db: Db): User`,
        swift: `// Hard-coded
func getUser(_ id: Int) -> User {
  let db = MySQLConnection()    // hard-coded
  return db.query("SELECT * FROM users WHERE id=\\(id)")
}
// Fix: func getUser(_ id: Int, db: Db) -> User`,
      },
    },
    {
      id: 'viscosidad', category: 'smells', name: 'Viscosidad',
      short: 'El atajo malo es más fácil que el bueno.',
      description: 'Hacer lo correcto cuesta tanto trabajo que terminas tomando atajos. El diseño "premia" la solución sucia.',
      howToFix: 'Construye utilidades comunes y patrones reusables para que la opción correcta sea trivial. Documenta el camino feliz.',
      examples: {
        javascript: `// Crear un objeto bien validado toma 20 líneas → todos lo crean a mano
const user = { name, email, age, role: 'user', createdAt: new Date(), ... };
// Fix: factory o builder reusable
const user = User.create({ name, email, age });`,
        python: `# Crear un User bien hecho cuesta mucho → todos toman el atajo
user = {"name": n, "email": e, "age": a, "role": "user", "created_at": now()}
# Fix: dataclass o factory reusable
user = User.create(name=n, email=e, age=a)`,
        cpp: `// Inicializar un struct correctamente cuesta → todos lo hacen "rápido"
User u; u.name = n; u.email = e; /* faltan defaults */
// Fix: constructor que pone defaults o factory
User u = User::create(n, e);`,
        kotlin: `// Construcción tediosa lleva al atajo
val user = User(name, email, age, "user", Date(), null, true, ...)
// Fix: data class con defaults o builder
val user = User.create(name, email, age)`,
        swift: `// Construcción tediosa lleva al atajo
let user = User(name: n, email: e, age: a, role: "user", createdAt: Date(), ...)
// Fix: convenience init o factory
let user = User.make(name: n, email: e, age: a)`,
      },
    },
    {
      id: 'duplicado', category: 'smells', name: 'Código duplicado',
      short: 'El mismo bloque en varios lugares.',
      description: 'La misma lógica aparece copiada en distintas funciones o clases. Cualquier corrección hay que aplicarla N veces — y se nos olvida alguna.',
      howToFix: 'Extract Method. Si los datos varían, parametriza. Si la estructura es la misma con tipos distintos, usa polimorfismo o un map de estrategias.',
      examples: {
        javascript: `// Tres funciones casi idénticas
function totalA(items) { let s=0; for (const i of items) s += i.price * i.qty; return s; }
function totalB(items) { let s=0; for (const i of items) s += i.price * i.qty * 1.16; return s; }
// Fix:
const total = (items, factor=1) =>
  items.reduce((s, i) => s + i.price*i.qty*factor, 0);`,
        python: `# Tres funciones casi idénticas
def total_a(items): return sum(i.price * i.qty for i in items)
def total_b(items): return sum(i.price * i.qty * 1.16 for i in items)
# Fix:
def total(items, factor=1):
    return sum(i.price * i.qty * factor for i in items)`,
        cpp: `// Repetición
double totalA(const std::vector<Item>& v) { /* sum price*qty */ }
double totalB(const std::vector<Item>& v) { /* sum price*qty*1.16 */ }
// Fix: una función con parámetro factor
double total(const std::vector<Item>& v, double factor = 1.0);`,
        kotlin: `// Duplicación
fun totalA(items: List<Item>) = items.sumOf { it.price * it.qty }
fun totalB(items: List<Item>) = items.sumOf { it.price * it.qty * 1.16 }
// Fix:
fun total(items: List<Item>, factor: Double = 1.0) =
    items.sumOf { it.price * it.qty * factor }`,
        swift: `// Duplicación
func totalA(_ items: [Item]) -> Double { items.reduce(0) { $0 + $1.price * $1.qty } }
func totalB(_ items: [Item]) -> Double { items.reduce(0) { $0 + $1.price * $1.qty * 1.16 } }
// Fix:
func total(_ items: [Item], factor: Double = 1.0) -> Double {
    items.reduce(0) { $0 + $1.price * $1.qty * factor }
}`,
      },
    },
    {
      id: 'metodo-largo', category: 'smells', name: 'Método largo',
      short: 'Más de 15-20 líneas. Hace muchas cosas.',
      description: 'Una función que valida, calcula, formatea y persiste en una sola pieza. Difícil de leer, testear y reusar.',
      howToFix: 'Extract Method por bloques cohesivos. La función original queda como un Compose Method que solo orquesta llamadas con nombres claros.',
      examples: {
        javascript: `// Antes: 1 función hace TODO
function checkout(cart, user) {
  // validar (10 líneas)
  // calcular total (8 líneas)
  // cobrar (12 líneas)
  // emitir factura (10 líneas)
}
// Después:
function checkout(cart, user) {
  validar(cart, user);
  const total = calcularTotal(cart);
  cobrar(user, total);
  emitirFactura(cart, total);
}`,
        python: `# Antes: 1 función hace TODO (40+ líneas)
def checkout(cart, user):
    # validar, calcular, cobrar, facturar inline...

# Después:
def checkout(cart, user):
    validar(cart, user)
    total = calcular_total(cart)
    cobrar(user, total)
    emitir_factura(cart, total)`,
        cpp: `// Antes: una función gigante
void checkout(Cart& c, User& u) { /* 50 líneas mezcladas */ }
// Después:
void checkout(Cart& c, User& u) {
  validar(c, u);
  double total = calcularTotal(c);
  cobrar(u, total);
  emitirFactura(c, total);
}`,
        kotlin: `// Antes: función monolítica de 50 líneas
// Después:
fun checkout(cart: Cart, user: User) {
  validar(cart, user)
  val total = calcularTotal(cart)
  cobrar(user, total)
  emitirFactura(cart, total)
}`,
        swift: `// Antes: monolítica
// Después:
func checkout(_ cart: Cart, _ user: User) {
  validar(cart, user)
  let total = calcularTotal(cart)
  cobrar(user, total)
  emitirFactura(cart, total)
}`,
      },
    },
    {
      id: 'clase-grande', category: 'smells', name: 'Clase grande (God class)',
      short: 'Más de 200-300 líneas, muchos métodos públicos.',
      description: 'Una clase que sabe demasiado y hace demasiado. Tiene varias razones para cambiar (viola SRP) y se vuelve un cuello de botella.',
      howToFix: 'Extract Class. Identifica grupos de métodos/campos que cambian juntos y muévelos a una clase nueva.',
      examples: {
        javascript: `// Antes: una clase con responsabilidades mezcladas
class Order {
  validate() { ... } calculate() { ... }
  saveToDb() { ... } sendEmail() { ... }
  exportToPdf() { ... } applyDiscount() { ... }
}
// Después: separa por responsabilidad
class Order { /* dominio */ }
class OrderRepository { /* DB */ }
class OrderNotifier { /* email */ }
class OrderExporter  { /* PDF */ }`,
        python: `# Antes: God class
class Order:
    def validate(self): ...
    def save_to_db(self): ...
    def send_email(self): ...
    def export_pdf(self): ...
# Después:
class Order: ...
class OrderRepository: ...
class OrderNotifier: ...
class OrderExporter: ...`,
        cpp: `// Antes
class Order { public:
  void validate(); void save();
  void sendEmail(); void exportPdf();
};
// Después: separación por responsabilidad
class Order { /* dominio */ };
class OrderRepository { /* persistencia */ };
class OrderNotifier { /* email */ };`,
        kotlin: `// Antes
class Order {
  fun validate() {}; fun save() {}; fun email() {}; fun pdf() {}
}
// Después
class Order { /* dominio */ }
class OrderRepository
class OrderNotifier
class OrderExporter`,
        swift: `// Antes
class Order {
  func validate() {}; func save() {}; func email() {}; func pdf() {}
}
// Después
class Order {}
class OrderRepository {}
class OrderNotifier {}
class OrderExporter {}`,
      },
    },
    {
      id: 'long-params', category: 'smells', name: 'Lista larga de parámetros',
      short: 'Más de 3-4 parámetros sueltos.',
      description: 'Una función con muchos argumentos sueltos es difícil de llamar (¿cuál era el orden?), difícil de extender y suele indicar que varios parámetros pertenecen al mismo concepto.',
      howToFix: 'Introduce Parameter Object: agrupa los parámetros que viajan juntos en una estructura/clase con nombre.',
      examples: {
        javascript: `// Antes
function crearUser(name, email, age, role, banned, createdAt, tz) { ... }
// Después
function crearUser(profile) { ... }
crearUser({ name, email, age, role: 'user', banned: false });`,
        python: `# Antes
def crear_user(name, email, age, role, banned, created_at, tz): ...
# Después (dataclass o dict)
@dataclass
class Profile: name: str; email: str; age: int
def crear_user(profile: Profile): ...`,
        cpp: `// Antes
void crearUser(string n, string e, int age, string role, bool banned, time_t t);
// Después
struct Profile { std::string name, email; int age; /* ... */ };
void crearUser(const Profile& p);`,
        kotlin: `// Antes
fun crearUser(name: String, email: String, age: Int, role: String, banned: Boolean)
// Después
data class Profile(val name: String, val email: String, val age: Int)
fun crearUser(profile: Profile)`,
        swift: `// Antes
func crearUser(name: String, email: String, age: Int, role: String, banned: Bool)
// Después
struct Profile { let name: String; let email: String; let age: Int }
func crearUser(_ profile: Profile)`,
      },
    },
    {
      id: 'obsesion-primitiva', category: 'smells', name: 'Obsesión primitiva',
      short: 'Strings/ints para representar dominio.',
      description: 'Usar tipos básicos (string, int, bool) para representar conceptos del dominio (email, dinero, IDs) lleva a validaciones repetidas y errores fáciles de cometer.',
      howToFix: 'Extract Class / value object. Crea un tipo "Email", "Money", "UserId" que encapsule reglas de validación.',
      examples: {
        javascript: `// Antes: emails como strings sueltos
function send(to, body) {
  if (!to.includes('@')) throw 'bad';
  ...
}
// Después: tipo Email valida una sola vez
class Email {
  constructor(v) { if (!v.includes('@')) throw 'bad'; this.v = v; }
}
function send(to /* Email */, body) { ... }`,
        python: `# Antes
def send(to: str, body: str):
    if "@" not in to: raise ValueError
# Después
class Email:
    def __init__(self, v: str):
        if "@" not in v: raise ValueError
        self.v = v
def send(to: Email, body: str): ...`,
        cpp: `// Antes: string como email
void send(const std::string& to, const std::string& body);
// Después: tipo Email
class Email { public: explicit Email(std::string v); /* valida en ctor */ };
void send(const Email& to, const std::string& body);`,
        kotlin: `// Antes
fun send(to: String, body: String) { /* valida cada vez */ }
// Después
@JvmInline
value class Email(val v: String) {
    init { require(v.contains("@")) }
}
fun send(to: Email, body: String)`,
        swift: `// Antes
func send(to: String, body: String) { /* valida cada vez */ }
// Después
struct Email {
  let v: String
  init?(_ v: String) { guard v.contains("@") else { return nil }; self.v = v }
}
func send(to: Email, body: String)`,
      },
    },
    {
      id: 'envidia', category: 'smells', name: 'Envidia de características',
      short: 'Un método usa más datos de otra clase.',
      description: 'Un método hace `otra.x`, `otra.y`, `otra.z` más que usar sus propios datos. Está envidiando a otra clase: probablemente pertenece allá.',
      howToFix: 'Move Method. Pasa el método a la clase cuyos datos usa. "Tell, Don\'t Ask".',
      examples: {
        javascript: `// Antes: Factura calcula sobre Cliente
class Factura {
  totalConDescuento(cliente) {
    return this.total * (1 - cliente.tipo === 'oro' ? 0.1 : 0);
  }
}
// Después: el cliente sabe su descuento
class Cliente { descuento() { return this.tipo==='oro'?0.1:0; } }
class Factura { totalConDescuento(c) { return this.total*(1-c.descuento()); } }`,
        python: `# Antes
class Factura:
    def total_con_desc(self, cliente):
        return self.total * (1 - (0.1 if cliente.tipo == 'oro' else 0))
# Después
class Cliente:
    def descuento(self): return 0.1 if self.tipo == 'oro' else 0
class Factura:
    def total_con_desc(self, c): return self.total * (1 - c.descuento())`,
        cpp: `// Antes: Factura mete las manos en Cliente
double Factura::total(const Cliente& c) const { /* lee c.tipo, c.fecha, ... */ }
// Después
double Cliente::descuento() const { return tipo == "oro" ? 0.1 : 0; }
double Factura::total(const Cliente& c) const { return total_ * (1 - c.descuento()); }`,
        kotlin: `// Antes
class Factura(val total: Double) {
  fun conDescuento(c: Cliente) = total * (1 - if (c.tipo=="oro") 0.1 else 0.0)
}
// Después
class Cliente(val tipo: String) { fun descuento() = if (tipo=="oro") 0.1 else 0.0 }
class Factura(val total: Double) { fun conDescuento(c: Cliente) = total * (1 - c.descuento()) }`,
        swift: `// Antes
class Factura {
  func total(con c: Cliente) -> Double { /* lee c.tipo, c.fecha... */ }
}
// Después
extension Cliente { func descuento() -> Double { tipo == "oro" ? 0.1 : 0 } }
extension Factura { func total(con c: Cliente) -> Double { total * (1 - c.descuento()) } }`,
      },
    },
    {
      id: 'switch', category: 'smells', name: 'Switch excesivo',
      short: 'switch(tipo) con muchas ramas.',
      description: 'Cada vez que agregas un tipo nuevo, tocas el switch (violación de OCP). Suele aparecer junto con duplicación entre las ramas.',
      howToFix: 'Replace Conditional with Polymorphism. En lenguajes OO: subclases con método polimórfico. En JS/Py: mapa de estrategias por tipo.',
      examples: {
        javascript: `// Antes
function area(f) {
  switch (f.tipo) {
    case 'cuadrado': return f.lado**2;
    case 'circulo':  return Math.PI*f.r**2;
  }
}
// Después: mapa de estrategias
const AREA = {
  cuadrado: f => f.lado**2,
  circulo:  f => Math.PI*f.r**2,
};
const area = f => AREA[f.tipo](f);`,
        python: `# Antes
def area(f):
    if f.tipo == "cuadrado": return f.lado**2
    if f.tipo == "circulo":  return math.pi * f.r**2
# Después: clases o mapa
AREA = {
  "cuadrado": lambda f: f.lado**2,
  "circulo":  lambda f: math.pi * f.r**2,
}
def area(f): return AREA[f.tipo](f)`,
        cpp: `// Antes: switch
double area(const Figura& f) { switch(f.tipo) { ... } }
// Después: polimorfismo
class Figura { virtual double area() const = 0; };
class Cuadrado : public Figura { double area() const override { return lado*lado; } };
class Circulo  : public Figura { double area() const override { return M_PI*r*r; } };`,
        kotlin: `// Antes: when gigante
fun area(f: Figura): Double = when (f.tipo) { ... }
// Después: sealed class + polimorfismo
sealed class Figura { abstract fun area(): Double }
class Cuadrado(val lado: Double): Figura() { override fun area() = lado*lado }
class Circulo(val r: Double):     Figura() { override fun area() = PI*r*r }`,
        swift: `// Antes: switch
func area(_ f: Figura) -> Double { switch f.tipo { ... } }
// Después: protocolo
protocol Figura { func area() -> Double }
struct Cuadrado: Figura { let lado: Double; func area() -> Double { lado*lado } }
struct Circulo:  Figura { let r: Double;    func area() -> Double { .pi*r*r } }`,
      },
    },

    // ============================================================
    // SOLID
    // ============================================================
    {
      id: 'srp', category: 'solid', name: 'SRP — Single Responsibility',
      short: 'Una clase, una sola razón para cambiar.',
      description: 'Cada clase/módulo debe tener una sola responsabilidad. Si una clase cambia por más de una razón (negocio cambia, formato cambia, persistencia cambia), divídela.',
      howToFix: 'Identifica los "actores" o "ejes de cambio" de la clase. Crea una clase por cada eje.',
      examples: {
        javascript: `// Mal: hace negocio + persistencia + email
class Order {
  total() { ... }
  save()  { db.save(this); }
  email() { mailer.send(...); }
}
// Bien: una responsabilidad por clase
class Order { total() {...} }
class OrderRepo { save(o) {...} }
class OrderMailer { confirm(o) {...} }`,
        python: `# Mal
class Order:
    def total(self): ...
    def save(self): ...
    def email(self): ...
# Bien
class Order: ...
class OrderRepo: ...
class OrderMailer: ...`,
        cpp: `// Mal: negocio + IO + email
class Order { public:
  double total(); void save(); void email();
};
// Bien
class Order { double total(); };
class OrderRepo { void save(const Order&); };
class OrderMailer { void confirm(const Order&); };`,
        kotlin: `// Mal
class Order { fun total(){}; fun save(){}; fun email(){} }
// Bien
class Order { fun total() {} }
class OrderRepo { fun save(o: Order) {} }
class OrderMailer { fun confirm(o: Order) {} }`,
        swift: `// Mal
class Order { func total(){}; func save(){}; func email(){} }
// Bien
class Order { func total() {} }
class OrderRepo { func save(_ o: Order) {} }
class OrderMailer { func confirm(_ o: Order) {} }`,
      },
    },
    {
      id: 'ocp', category: 'solid', name: 'OCP — Open / Closed',
      short: 'Abierto a extender, cerrado a modificar.',
      description: 'Debes poder agregar nuevos comportamientos sin modificar el código existente. Suele lograrse con polimorfismo o tablas de estrategias.',
      howToFix: 'En vez de modificar un switch cada que llega un caso nuevo, agrega una nueva clase/estrategia/función que cumpla con la abstracción común.',
      examples: {
        javascript: `// Mal: agregar formato → tocar la función
function exportar(t, datos) {
  if (t==='json') return JSON.stringify(datos);
  if (t==='csv')  return toCsv(datos);
}
// Bien: registry abierto a nuevos formatters
const FMT = { json: JSON.stringify, csv: toCsv };
function exportar(t, datos) { return FMT[t](datos); }
// agregar 'xml': FMT.xml = toXml;`,
        python: `# Mal
def exportar(t, datos):
    if t == "json": return json.dumps(datos)
    if t == "csv":  return to_csv(datos)
# Bien
FMT = {"json": json.dumps, "csv": to_csv}
def exportar(t, datos): return FMT[t](datos)`,
        cpp: `// Mal: tocar switch para nuevo formato
// Bien: jerarquía de Formatter (polimorfismo)
class Formatter { public: virtual std::string format(const Data&) = 0; };
class JsonF : public Formatter { ... };
class CsvF  : public Formatter { ... };
std::string exportar(Formatter& f, const Data& d) { return f.format(d); }`,
        kotlin: `// Mal: when crece con cada formato
// Bien: interfaz + registro
interface Formatter { fun format(d: Data): String }
val FMT = mapOf("json" to JsonFmt(), "csv" to CsvFmt())
fun exportar(t: String, d: Data) = FMT.getValue(t).format(d)`,
        swift: `// Mal: switch crece con cada formato
// Bien
protocol Formatter { func format(_ d: Data) -> String }
let FMT: [String: Formatter] = ["json": JsonF(), "csv": CsvF()]
func exportar(_ t: String, _ d: Data) -> String { FMT[t]!.format(d) }`,
      },
    },
    {
      id: 'lsp', category: 'solid', name: 'LSP — Liskov Substitution',
      short: 'Las subclases no rompen al padre.',
      description: 'Cualquier objeto de tipo T debería poder ser reemplazado por uno de su subtipo S sin alterar la corrección del programa. Si la subclase lanza excepción donde el padre no, viola LSP.',
      howToFix: 'No "estreches" precondiciones ni "ensanches" postcondiciones. Si una subclase no cumple el contrato, no es una subclase, es otra cosa.',
      examples: {
        javascript: `// Mal: Cuadrado hereda de Rectángulo y rompe set ancho/alto
class Rect { setW(w){this.w=w} setH(h){this.h=h} area(){return this.w*this.h} }
class Square extends Rect { setW(w){this.w=this.h=w} setH(h){this.w=this.h=h} }
// Una función que esperaba un Rect ahora falla.
// Fix: no usar herencia aquí; ambos implementan una interfaz "Figura".`,
        python: `# Mal: Cuadrado-de-Rectangulo rompe contrato
class Rect:
    def set_w(self, w): self.w = w
    def set_h(self, h): self.h = h
class Square(Rect):
    def set_w(self, w): self.w = self.h = w
# Fix: no heredes solo para reusar; comparten interfaz, no implementación.`,
        cpp: `// Mal: Square hereda de Rect y altera el invariante
// Fix: ambos derivan de Shape (interfaz pura)
class Shape { public: virtual double area() const = 0; };
class Rect   : public Shape { ... };
class Square : public Shape { ... };`,
        kotlin: `// Bien: ambos implementan Figura, no Square : Rect
interface Figura { fun area(): Double }
class Rect(val w: Double, val h: Double) : Figura { override fun area() = w*h }
class Square(val l: Double) : Figura { override fun area() = l*l }`,
        swift: `// Bien: protocolo común, no herencia tramposa
protocol Figura { func area() -> Double }
struct Rect:   Figura { let w, h: Double; func area() -> Double { w*h } }
struct Square: Figura { let l: Double;    func area() -> Double { l*l } }`,
      },
    },
    {
      id: 'isp', category: 'solid', name: 'ISP — Interface Segregation',
      short: 'Interfaces pequeñas y específicas.',
      description: 'Mejor varias interfaces pequeñas que una grande "todo en uno". Un cliente no debería estar forzado a depender de métodos que no usa.',
      howToFix: 'Divide interfaces grandes por rol. Que cada implementación implemente solo lo que de verdad necesita.',
      examples: {
        javascript: `// Mal: una interface MultiFuncion obliga a implementar lo que no usas
class Robot extends Worker { eat() { throw 'no como' } work() { ... } }
// Bien: separa roles
class Workable { work() {} }
class Eatable  { eat()  {} }
class Robot extends Workable { ... }
class Human extends Workable { ... } // ademas implementa Eatable`,
        python: `# Mal
class Worker:
    def work(self): ...
    def eat(self): ...
class Robot(Worker):  # forzado a implementar eat
    def eat(self): raise NotImplementedError
# Bien: protocolos separados
class Workable(Protocol):
    def work(self): ...
class Eatable(Protocol):
    def eat(self): ...`,
        cpp: `// Mal: una interfaz "fat"
class IWorker { public: virtual void work()=0; virtual void eat()=0; };
// Bien: dos interfaces
class IWorkable { public: virtual void work()=0; };
class IEatable  { public: virtual void eat()=0;  };
class Robot : public IWorkable { void work() override {} };`,
        kotlin: `// Mal: interfaz multi-función
interface Worker { fun work(); fun eat() }
// Bien
interface Workable { fun work() }
interface Eatable  { fun eat() }
class Robot : Workable { override fun work() {} }
class Human : Workable, Eatable { override fun work() {}; override fun eat() {} }`,
        swift: `// Mal: protocolo enorme
protocol Worker { func work(); func eat() }
// Bien
protocol Workable { func work() }
protocol Eatable  { func eat() }
struct Robot: Workable { func work() {} }
struct Human: Workable, Eatable { func work() {}; func eat() {} }`,
      },
    },
    {
      id: 'dip', category: 'solid', name: 'DIP — Dependency Inversion',
      short: 'Depende de abstracciones, no de concreciones.',
      description: 'Los módulos de alto nivel no deben depender de los de bajo nivel; ambos dependen de abstracciones. Las abstracciones no dependen de detalles.',
      howToFix: 'Define una interface para la dependencia. La concreta se inyecta por constructor/parámetro. Para testear, pasa un fake.',
      examples: {
        javascript: `// Mal: Service depende de MySQL concreto
class Service {
  constructor() { this.db = new MySQL(); }
}
// Bien
class Service {
  constructor(db /* IDb */) { this.db = db; }
}
new Service(new MySQL()); // o new Service(new FakeDb()) en tests`,
        python: `# Mal
class Service:
    def __init__(self): self.db = MySQL()
# Bien
class Service:
    def __init__(self, db): self.db = db
Service(MySQL())  # en producción
Service(FakeDb()) # en tests`,
        cpp: `// Bien: depende de la interfaz, no de la concreta
class IDb { public: virtual void save() = 0; };
class Service {
  IDb& db_;
public:
  Service(IDb& db) : db_(db) {}
};`,
        kotlin: `// Bien: inyecta interfaz
interface Db { fun save() }
class Service(private val db: Db) { fun run() { db.save() } }
Service(MySql())
Service(FakeDb())  // tests`,
        swift: `// Bien: protocolo + DI
protocol Db { func save() }
class Service { let db: Db; init(_ db: Db) { self.db = db } }
Service(MySql()); Service(FakeDb())`,
      },
    },

    // ============================================================
    // POO (Pilares)
    // ============================================================
    {
      id: 'encapsulacion', category: 'poo', name: 'Encapsulación',
      short: 'Esconde detalles, expón comportamiento.',
      description: 'Los datos internos de un objeto se protegen; el mundo exterior interactúa a través de métodos públicos que mantienen los invariantes. Evita estados inválidos.',
      howToFix: 'Campos privados/internal. Validar en setters. Preferir métodos de comportamiento (`deposit(x)`) sobre setters genéricos (`setSaldo(x)`).',
      examples: {
        javascript: `// Bien: prefiere métodos de comportamiento
class Cuenta {
  #saldo = 0;
  depositar(m) { if (m <= 0) throw 'monto invalido'; this.#saldo += m; }
  saldo() { return this.#saldo; }
}`,
        python: `class Cuenta:
    def __init__(self): self._saldo = 0
    def depositar(self, m):
        if m <= 0: raise ValueError("monto invalido")
        self._saldo += m
    @property
    def saldo(self): return self._saldo`,
        cpp: `class Cuenta {
  double saldo_ = 0;       // private por default en class
public:
  void depositar(double m) { if (m <= 0) throw std::invalid_argument(""); saldo_ += m; }
  double saldo() const { return saldo_; }
};`,
        kotlin: `class Cuenta {
  private var saldo_ = 0.0
  fun depositar(m: Double) {
    require(m > 0) { "monto invalido" }
    saldo_ += m
  }
  fun saldo() = saldo_
}`,
        swift: `class Cuenta {
  private var saldo_: Double = 0
  func depositar(_ m: Double) {
    precondition(m > 0, "monto invalido")
    saldo_ += m
  }
  func saldo() -> Double { saldo_ }
}`,
      },
    },
    {
      id: 'herencia', category: 'poo', name: 'Herencia',
      short: 'Especialización: B "es-un" A.',
      description: 'Una subclase reutiliza y extiende el comportamiento de su padre. Útil cuando hay una relación clara "es-un" y comparten contrato.',
      howToFix: 'Úsala con cuidado: si solo quieres reutilizar código, prefiere composición. Si hereda y rompe contrato, viola LSP.',
      examples: {
        javascript: `class Animal { mover() { console.log('camina'); } }
class Perro extends Animal {
  mover() { console.log('corre y mueve la cola'); }
  ladrar() { console.log('woof'); }
}
new Perro().mover();  // override
new Perro().ladrar();`,
        python: `class Animal:
    def mover(self): print("camina")
class Perro(Animal):
    def mover(self): print("corre y mueve la cola")
    def ladrar(self): print("woof")`,
        cpp: `class Animal { public: virtual void mover() { /* camina */ } virtual ~Animal()=default; };
class Perro : public Animal {
public:
  void mover() override { /* corre */ }
  void ladrar() { /* woof */ }
};`,
        kotlin: `open class Animal { open fun mover() = println("camina") }
class Perro : Animal() {
  override fun mover() = println("corre")
  fun ladrar() = println("woof")
}`,
        swift: `class Animal { func mover() { print("camina") } }
class Perro: Animal {
  override func mover() { print("corre") }
  func ladrar() { print("woof") }
}`,
      },
    },
    {
      id: 'polimorfismo', category: 'poo', name: 'Polimorfismo',
      short: 'Mismo mensaje, múltiples comportamientos.',
      description: 'Diferentes clases responden al mismo método de forma distinta. Permite que el código cliente trabaje con la abstracción sin saber el tipo concreto.',
      howToFix: 'Define un contrato común (interface, clase abstracta, protocol). Cada tipo lo implementa a su manera. El cliente solo invoca la interface.',
      examples: {
        javascript: `class Figura { area() {} }
class Cuadrado extends Figura { constructor(l){ super(); this.l=l; } area(){ return this.l*this.l; } }
class Circulo  extends Figura { constructor(r){ super(); this.r=r; } area(){ return Math.PI*this.r**2; } }

const figuras = [new Cuadrado(3), new Circulo(2)];
figuras.forEach(f => console.log(f.area())); // 9, 12.56...`,
        python: `class Figura:
    def area(self): raise NotImplementedError
class Cuadrado(Figura):
    def __init__(self, l): self.l = l
    def area(self): return self.l * self.l
class Circulo(Figura):
    def __init__(self, r): self.r = r
    def area(self): return math.pi * self.r**2
for f in [Cuadrado(3), Circulo(2)]: print(f.area())`,
        cpp: `class Figura { public: virtual double area() const = 0; virtual ~Figura()=default; };
class Cuadrado : public Figura { double l; public: Cuadrado(double l):l(l){} double area() const override { return l*l; } };
class Circulo  : public Figura { double r; public: Circulo (double r):r(r){} double area() const override { return M_PI*r*r; } };

std::vector<std::unique_ptr<Figura>> v;
for (auto& f : v) std::cout << f->area();`,
        kotlin: `sealed class Figura { abstract fun area(): Double }
class Cuadrado(val l: Double): Figura() { override fun area() = l * l }
class Circulo (val r: Double): Figura() { override fun area() = PI * r * r }
listOf(Cuadrado(3.0), Circulo(2.0)).forEach { println(it.area()) }`,
        swift: `protocol Figura { func area() -> Double }
struct Cuadrado: Figura { let l: Double; func area() -> Double { l * l } }
struct Circulo:  Figura { let r: Double; func area() -> Double { .pi * r * r } }
[Cuadrado(l: 3), Circulo(r: 2)].forEach { print($0.area()) }`,
      },
    },
    {
      id: 'abstraccion', category: 'poo', name: 'Abstracción',
      short: 'Modela lo esencial; oculta el resto.',
      description: 'Representas en código solo los atributos y comportamientos relevantes al problema. Una abstracción es un contrato que dice "qué hace" sin decir "cómo".',
      howToFix: 'Define interfaces o clases abstractas con los métodos esenciales. Los detalles concretos quedan en implementaciones intercambiables.',
      examples: {
        javascript: `// Abstracción: "puedo guardar y leer datos"
class Repository {
  save(item)  { throw 'abstract'; }
  find(id)    { throw 'abstract'; }
}
class InMemoryRepo extends Repository { /* Map */ }
class MongoRepo   extends Repository { /* mongo client */ }`,
        python: `from abc import ABC, abstractmethod
class Repository(ABC):
    @abstractmethod
    def save(self, item): ...
    @abstractmethod
    def find(self, id):   ...

class InMemoryRepo(Repository): ...
class MongoRepo(Repository): ...`,
        cpp: `class Repository {
public:
  virtual void save(const Item&) = 0;
  virtual Item find(int id)      = 0;
  virtual ~Repository() = default;
};
class InMemoryRepo : public Repository { ... };`,
        kotlin: `interface Repository {
  fun save(item: Item)
  fun find(id: Int): Item?
}
class InMemoryRepo : Repository { /* ... */ }
class MongoRepo   : Repository { /* ... */ }`,
        swift: `protocol Repository {
  func save(_ item: Item)
  func find(_ id: Int) -> Item?
}
struct InMemoryRepo: Repository { /* ... */ }
struct MongoRepo:    Repository { /* ... */ }`,
      },
    },
    {
      id: 'composicion', category: 'poo', name: 'Composición sobre Herencia',
      short: 'Combina piezas en vez de heredar.',
      description: 'Prefiere construir comportamiento componiendo objetos pequeños en vez de heredar de jerarquías profundas. Más flexible y menos acoplado.',
      howToFix: 'Si solo necesitas reusar comportamiento, inyecta una dependencia que lo provea. Reserva la herencia para verdaderas relaciones "es-un".',
      examples: {
        javascript: `// Mal: jerarquía compleja
class FlyingSwimmingDuck extends Duck { ... }
// Bien: composición
class Duck {
  constructor(fly, swim) { this.fly = fly; this.swim = swim; }
  perform() { this.fly(); this.swim(); }
}
new Duck(rocketFly, fastSwim).perform();`,
        python: `# Composición
class Duck:
    def __init__(self, fly, swim):
        self.fly, self.swim = fly, swim
    def perform(self): self.fly(); self.swim()

duck = Duck(rocket_fly, fast_swim)`,
        cpp: `// Composición sobre herencia
class Duck {
  std::function<void()> fly_, swim_;
public:
  Duck(std::function<void()> f, std::function<void()> s): fly_(f), swim_(s) {}
  void perform() { fly_(); swim_(); }
};`,
        kotlin: `// Composición con functional types
class Duck(val fly: () -> Unit, val swim: () -> Unit) {
  fun perform() { fly(); swim() }
}
Duck(::rocketFly, ::fastSwim).perform()`,
        swift: `class Duck {
  let fly: () -> Void
  let swim: () -> Void
  init(fly: @escaping () -> Void, swim: @escaping () -> Void) {
    self.fly = fly; self.swim = swim
  }
  func perform() { fly(); swim() }
}`,
      },
    },

    // ============================================================
    // PRINCIPIOS GENERALES
    // ============================================================
    {
      id: 'dry', category: 'principles', name: 'DRY — Don\'t Repeat Yourself',
      short: 'Cada conocimiento, una sola representación.',
      description: 'Si el mismo conocimiento (regla, fórmula, validación) aparece duplicado, cualquier corrección debe aplicarse N veces. Extrae a una sola fuente de verdad.',
      howToFix: 'Cuando veas el mismo patrón 2-3 veces: Extract Method, constante, helper compartido o tabla de configuración.',
      examples: {
        javascript: `// Mal
if (user.age < 18) throw 'menor';   // en API
if (user.age < 18) return false;    // en UI
// Bien
const ES_ADULTO = (u) => u.age >= 18;
if (!ES_ADULTO(user)) throw 'menor';
if (!ES_ADULTO(user)) return false;`,
        python: `# Mal: regla duplicada
if user.age < 18: raise
if user.age < 18: return False
# Bien
def es_adulto(u): return u.age >= 18
if not es_adulto(user): raise`,
        cpp: `// Mal
if (u.age < 18) throw ...;
if (u.age < 18) return false;
// Bien
constexpr int EDAD_MIN = 18;
bool esAdulto(const User& u) { return u.age >= EDAD_MIN; }`,
        kotlin: `// Bien
fun esAdulto(u: User) = u.age >= 18
if (!esAdulto(user)) error("menor")`,
        swift: `func esAdulto(_ u: User) -> Bool { u.age >= 18 }
if !esAdulto(user) { fatalError("menor") }`,
      },
    },
    {
      id: 'kiss', category: 'principles', name: 'KISS — Keep It Simple, Stupid',
      short: 'No compliques sin necesidad.',
      description: 'La solución más simple que resuelve el problema casi siempre es la correcta. La complejidad cuesta: bugs, onboarding, mantenimiento.',
      howToFix: 'Empieza por la versión obvia. Solo agrega complejidad cuando un requisito real la justifica.',
      examples: {
        javascript: `// Mal: framework de validación genérico para 3 campos
const validator = new Validator(rulesEngine, ...);
// Bien
if (!email.includes('@')) errors.push('email');
if (age < 0)              errors.push('age');`,
        python: `# Mal: meta-programación para sumar dos enteros
class AdderFactory: ...
# Bien
def add(a, b): return a + b`,
        cpp: `// Mal: template metaprogramming para X simple
// Bien: función llana
int add(int a, int b) { return a + b; }`,
        kotlin: `// Bien
fun add(a: Int, b: Int) = a + b`,
        swift: `// Bien
func add(_ a: Int, _ b: Int) -> Int { a + b }`,
      },
    },
    {
      id: 'yagni', category: 'principles', name: 'YAGNI — You Aren\'t Gonna Need It',
      short: 'No construyas lo que no necesitas ya.',
      description: 'No agregues funcionalidad "por si acaso". Cada feature no usada cuesta mantenerla y agrega superficie para bugs. Construye cuando un requerimiento real aparece.',
      howToFix: 'Cuando dudes si algo se va a usar: no lo agregues. Es más barato agregarlo después que removerlo.',
      examples: {
        javascript: `// Mal: 5 parámetros opcionales "para futuro"
function login(u, p, totpCode, biometricData, ssoToken, ...) { /* solo usa u, p */ }
// Bien
function login(u, p) { ... }
// agregar el resto solo cuando exista el requisito`,
        python: `# Mal: hooks de extensión que nadie usa
# Bien
def login(u, p): ...`,
        cpp: `// Bien: solo lo que necesitas hoy
bool login(const std::string& u, const std::string& p);`,
        kotlin: `fun login(u: String, p: String): Boolean = ...`,
        swift: `func login(_ u: String, _ p: String) -> Bool { ... }`,
      },
    },
    {
      id: 'tell-dont-ask', category: 'principles', name: 'Tell, Don\'t Ask',
      short: 'Pídele al objeto que actúe, no le preguntes.',
      description: 'En lugar de extraer datos del objeto, hacer cálculos afuera y volver a meterle el resultado, dile que haga el trabajo él mismo. Encapsula comportamiento, no solo datos.',
      howToFix: 'Si ves un código que hace `if (obj.x > 0) obj.y = ...`, mueve esa lógica como método del objeto: `obj.activarSi...()`.',
      examples: {
        javascript: `// Ask
if (cuenta.saldo >= monto) cuenta.saldo -= monto;
// Tell
cuenta.retirar(monto);  // que la cuenta valide y descuente`,
        python: `# Ask
if cuenta.saldo >= monto: cuenta.saldo -= monto
# Tell
cuenta.retirar(monto)`,
        cpp: `// Ask
if (cuenta.saldo() >= m) cuenta.setSaldo(cuenta.saldo() - m);
// Tell
cuenta.retirar(m);`,
        kotlin: `// Tell
cuenta.retirar(monto)`,
        swift: `// Tell
cuenta.retirar(monto)`,
      },
    },
    {
      id: 'demeter', category: 'principles', name: 'Law of Demeter',
      short: 'Habla solo con tus amigos directos.',
      description: 'Un método sólo debería llamar a métodos de: sí mismo, sus parámetros, los objetos que crea y sus campos directos. Cadenas como `a.b.c.d.e()` indican acoplamiento al detalle interno.',
      howToFix: 'Expón comportamiento, no estructura. Si necesitas datos profundos, agrega un método de fachada que los devuelva ya combinados.',
      examples: {
        javascript: `// Mal: navega 3 niveles
const ciudad = pedido.cliente.direccion.ciudad;
// Bien: que Pedido lo exponga
class Pedido { ciudadEntrega() { return this.cliente.ciudadEntrega(); } }
pedido.ciudadEntrega();`,
        python: `# Mal
ciudad = pedido.cliente.direccion.ciudad
# Bien
pedido.ciudad_entrega()`,
        cpp: `// Mal
auto c = pedido.getCliente().getDireccion().getCiudad();
// Bien
auto c = pedido.ciudadEntrega();`,
        kotlin: `// Bien
val ciudad = pedido.ciudadEntrega()`,
        swift: `// Bien
let ciudad = pedido.ciudadEntrega()`,
      },
    },
  ],
};
