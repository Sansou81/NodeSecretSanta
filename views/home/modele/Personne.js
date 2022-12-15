class Personne {
    #id;
    #nom;
    #email;
    #destinataire;

    constructor(id, nom, email) {
        this.#id = id;
        this.#nom = nom;
        this.#email = email;
    }

    getid() {
        return this.#id;
    }

    setid(value) {
        this.#id = value;
    }

    getnom() {
        return this.#nom;
    }

    setnom(value) {
        this.#nom = value;
    }

    getemail() {
        return this.#email;
    }

    setemail(value) {
        this.#email = value;
    }

    getdestinataire() {
        return this.#destinataire;
    }

    setdestinataire(value) {
        this.#destinataire = value;
    }

    /**
     * On utilise cette méthode pour préciser la structure du JSON d'une Personne
     * Elle est utilisée de manière implicite par la méthode JSON.stringify()
     */
    toJSON() {
        return {
            id: this.#id,
            nom: this.#nom,
            email: this.#email
        };
    }
}

module.exports = {
    Personne: Personne,
}
