# Dashboard

Dashboard con gráfica de ChartJs, utilizando la API de [Exchange Rate API](https://www.exchangerate-api.com/).

Guardado en localStorage para asegurar de no pasarse de peticiones (1500 por mes).

La petición para el código de divisas se hace solo una vez (Divisas en inglés), y las peticiones del valor de divisa por 1 dólar es cada día.

Carga 3 divisas por defecto si no detecta ninguna guardada, y guarda máximo 7 divisas.

Se muestra las divisas seleccionadas en una tabla, en la cual también se pueden eliminar

## Vista previa de página
![Vista previa página](./assets/images/Vista%20previa%20pagina.png)

## Vista previa de gráfica
![Vista previa gráfica](./assets/images/Vista%20previa%20grafica.png)

[Dashboard](https://dashboard-mlk.netlify.app/)

## Pruébalo

Clonar el proyecto
```powershell
git clone https://github.com/MrLuisKiller/dashboard.git
```
Entrar en el directorio del proyecto
```powershell
cd dashboard
```
Abrelo en el VSCode
```powershell
code .
```
