0.4:
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note [{"note": "Hello world"}]
    activate server
    server-->>browser: 302 redirect to /notes
    deactivate server

    Note right of browser: The browser is redirected to the page it was already in, thus refreshing the page to display the new note
```

0.5:
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript/React file
    deactivate server

    Note right of browser: The browser executes the JavaScript code to fetch the JSON

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: After fetching the JSON, the Spa.js populates the notes with the redrawNotes function
```

0.6:
```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>browser: Append the written note to the list of notes and call redrawNotes to refresh view

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa [{"note": "Hello world"}]
    activate server
    server-->>browser: 201 [{"message":"note created"}]
    deactivate server

```