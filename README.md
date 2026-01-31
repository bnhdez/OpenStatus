# 📡 OpenStatus

Un sistema de monitoreo de disponibilidad (uptime) y rendimiento para servicios web.

## 🚀 Cómo funciona
El proyecto utiliza una arquitectura "Serverless" para minimizar costos y mantenimiento:

1.  **Data Collection:** Un script en Node.js ejecutado periódicamente (Cron Job) verifica el estado de los sitios.
2.  **Storage:** Los resultados (latencia, códigos de estado) se persisten en **Supabase** (PostgreSQL).
3.  **Visualization:** Un dashboard en **React** (próximamente) consume los datos en tiempo real para calcular métricas de SLA.

## 🛠️ Stack Tecnológico
* **Frontend:** React, Vite, Tailwind CSS (En desarrollo)
* **Backend/DB:** Supabase
* **Automation:** GitHub Actions
* **Lenguaje:** JavaScript / Node.js