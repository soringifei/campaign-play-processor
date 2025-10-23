# Campaign Play Processor

Programul simuleaza cum functioneaza o platforma DOOH. Ecranele digitale trimit
evenimente cand ruleaza reclame,le procesez si le afisez pe un dashboard usor de
citit.

## Ce face aplicatia

Cand un ecran arata o reclama, trimite un mesaj catre server: -Primeste events
-Pune evenimentele queue -Le proceseaza pe rand, in background -Calculeaza
statistici pentru fiecare campanie in parte -Afiseaza rezultatele in dashoard

### Instalare

cd backend npm install cd ../frontend npm install

### Pornire

**Terminal 1 - Backend:** cd backend npm run dev: http://localhost:3000
**Terminal 2 - Frontend:** cd frontend npm run dev pe: http://localhost:5173

## Tech stack si de ce

### Backend: Node.js + Express + TS

**TS?**  
Pentru greseli. Daca trimiti un eveniment fara `campaign_id`, TypeScript iti
spune ca lipseste ceva. In JS, afli doar cand ruleaza codul si da eroare

**Node.js?**  
E simplu si nu stiu backend.

**Express?**  
E cel mai simplu framework pentru a crea API-uri REST.Express ofera mult in
cateva linii

### Frontend: React/TypeScript/Vite

**React?**  
E cel mai popular framework si stiam deja sa lucrez cu el.

**Chart.js?**  
Grafice simple si Chart.js face treaba asta perfect. Am facut un grafic cu bare
si unul circular in cateva linii de cod.

**V0.dev** V0.dev pentru theming is UX, apoi am pus niste clase. **Vite?**  
Bundler care porneste repede si salvarile se vad imediat in browser.

### Backend

`index.ts`s erver Express cu toate endpoint-urile `queue.ts` coada events si
worker procesare `store.ts` aici tinem statsuri campanie(map) `types.ts`
interfete TS

### Frontend

`App.tsx` componenta pricipala `BarChart.tsx` grafice (bara si doughnut)
`api.ts` functii pentru a comunicare cu backend-ul `types.ts` interfete TS

## Cum functioneaza

1 "Creeaza event" trimite POST la `/simulate` 2 Backend-ul genereaza un
eveniment random si il pune in queue 3 Worker-ul (care ruleaza la fiecare
secunda) ia primul eveniment 4 Actualizeaza statisticile campaniei respective 5
Frontend-ul intreaba serverul la fiecare 2 secunde daca sunt date noi 6
Graficele si cardurile se actualizeaza automat

**Hookuri in React?**  
Am folosit hooks (useState, useEffect, useCallback) pentru ca:

- `useState` tine datele in memorie(campanii, statistici). Cand se schimba,
  React re-deseneaza interfata
- `useEffect` ruleaza cod cand componenta se monteaza. L-am folosit pentru
  polling (sa iau date noi la fiecare 2 secunde)
- `useCallback` - face memoizare functiei `fetchData` ca sa nu se recreeze la
  fiecare render, altfel, `useEffect` intra in loop

  ## Endpoint-uri

`POST /events` Primeste un event si il baga in queue `GET /campaigns` Returneaza
campaniile cu statistici `POST /simulate` Genereaza un eveniment random
`POST /processing/start` sau `/processing/stop` - pauza/resume procesare
`GET /stats`- marimea cozii + cate evenimente s-au procesat

## Procesarea asincrona

In loc sa procesez evenimentele cum le primesc, le pun intr-o coada pentru ca:

-daca vin 1000 de eventuri deodata blochez serverul -le procesez pe rand cate
unul la pe secunda -pot sa pun pauza/in realitate, aici ai pune o coada de tipul
Redis/RabbitMQ

**Worker-ul e un `setInterval` simplu care ia primul eveniment din queue si il
proceseaza**

```
setInterval(() => {
	if (processing && queue.length > 0) {
		const event = queue.shift();
		applyEvent(event);
	}
}, 1000);
```

## Timp de lucru

Setup initial (backend + frontend) : -1 ora Logica de coada si procesare - 1.5h
Dashboard si grafice - 2h CSS - 45 min Testing si debugging - 45 minute

---

Total- aprox 6 ore

## Next steps

SQLite sau MongoDB ca sa nu pierd datele la restart Redis in loc de array pentru
coada Afisare date istorice sub forma de grafice Autentificare cu JWT Deploy pe
Render sau AWS Testare CI/CD - Github/ Gitlab pentru teste automate si deploy
