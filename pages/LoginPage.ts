import { Page, Locator } from '@playwright/test';

// Exportamos la clase para poder importarla y usarla en otros archivos, por ejemplo en login.test.ts
export class LoginPage { // Guardamos la página actual del navegador sobre la que va a trabajar esta clase
  readonly page: Page;
  readonly loginButton: Locator;
  readonly emailInput: Locator;  // Propiedades del objeto LoginPage: guardan la página actual y los locators principales que se usanen la pantalla de login
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly serverError: Locator;

  // El constructor se ejecuta al crear un objeto de esta clase con: new LoginPage(page)
  constructor(page: Page) {
    this.page = page; // Guardamos la página recibida dentro del objeto actual para poder usarla en otros métodos de la clase
    // Aquí definimos y centralizamos los locators de la pantalla de login para que sean fáciles de mantener y reutilizar en los tests. Si cambia el diseño de la página, solo tenemos que actualizar estos locators aquí.
    this.loginButton = page.getByTestId('login_button');
    this.emailInput = page.getByPlaceholder('email');
    this.passwordInput = page.getByTestId('password_input');
    this.submitButton = page.getByTestId('submit_button');
    this.serverError = page.getByTestId('server_error');
  }

  // Métodos para interactuar con la pantalla de login. Estos métodos encapsulan las acciones que se pueden realizar en la página de login, como abrir el formulario, llenar los campos y enviar el formulario. Esto hace que los tests sean más legibles y fáciles de mantener, ya que no tienen que preocuparse por los detalles de cómo se interactúa con la página, sino solo por qué acciones se quieren realizar.
  async openLoginForm() {
    await this.loginButton.click();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  // Método "agrupador" que ejecuta el flujo completo de login
  // Así evitamos repetir en cada test: abrir login + rellenar email + rellenar password + submit, y en su lugar solo llamamos a loginPage.login(email, password) con las credenciales que queremos probar. Esto hace que los tests sean más limpios y fáciles de entender, ya que se enfocan en el resultado esperado del login, sin distraerse con los pasos específicos para realizarlo.
  async login(email: string, password: string) {
    await this.openLoginForm();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}

