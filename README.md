# Challenge 1

* Per deployare tutti i servizi, lanciare ```lerna run deploy``` dalla root di progetto

* Per lanciare il graphql server, lanciare ```lerna run start --scope=@challenge1/fnc-*```

# Open points

* I CloudEvents per S3 non possono essere integrati nel serverless.yml, perchè le regole sono già esistenti e non vengono sovrascritte. E' quindi necessario crearle a mano. Come posso invece automatizzare?

* Mi mancano tutti gli script di creazione delle risorse, anche se rendendo gli ARN configurabili nel secrets.json il nome diventa arbitrario. Basta sapere che
  * Va creato un S3 bucket per lo storage dei csv
  * Va creato una tabella *customers* su DynamoDB con chiave ID_UTENTE

* Sono stato costretto ad implementare la più inefficiente paginazione lato server esistente. La limit su DynamoDB non va proprio usata, anche perchè o ti servono i primi x record ordinati su un ben preciso indice, altrimenti (come nel mio caso) ti costringe a fare scan in un ciclo finchè non trovi la pagina che ti serve e scarti il resto. Per fare questo si deve usare il parametro ExclusiveStartKey e assegnare il valore LastEvaluatedKey, che è uno dei field ritornati dalla scan. --- *E NON FUNZIONA* ---

* Devo assolutamente trovare un comando per distruggere tutto quello che ho fatto su AWS e capire se partendo da pulito funzionano tutti i deploy

* Mi manca un po' di pulizia nei ruoli utilizzati, ho visto che la IAM può essere impostata a priori e poi attaccata alle varie lambda

* Non ho fatto neanche un test, ero troppo concentrato sull'infrastruttura :-(