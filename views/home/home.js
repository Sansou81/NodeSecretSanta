const nodemailer = require('nodemailer');
const personnes = require('./modele/Personne');
const Personne = personnes.Personne;
const personneList = [];
let counter = 0;

module.exports = {
    /**
     * Méthode qui vérifie la validité d'une personne, et l'ajoute à la liste des participants si c'est le cas
     * Lors de l'ajout d'une personne, un compteur est incrémenté (simule l'id d'une BDD)
     * @param personneDto la personne à ajouter
     * @return true si la personne est valide et incorporée, false sinon
     */
    addPersonne: function addPersonne(personneDto) {
        let resultat = false;
        let nom = personneDto['nom'];
        let email = personneDto['email'];
        if (nom && email && checkMail(email) && !doesPersonneExist(email)) {
            personneList.push(new Personne(counter, nom, email));
            counter++;
            resultat = true;
        }
        return resultat;
    },

    /**
     * Méthode qui supprime une personne de la liste des paritcipants
     * @param id l'id de la personne à supprimer
     * @return true si la personne avec l'id mentionné existe et est supprimée, false sinon
     */
    supprimerPersonne: function supprimerPersonne(id) {
        let resultat = false;
        let index = personneList.findIndex(personne => personne.getid() === id);
        if (index !== -1) {
            personneList.splice(index, 1);
            resultat = true;
        }
        return resultat;
    },

    /**
     * Retourne la liste des participants
     * @return la liste des participants
     */
    getPersonne: function getPersonne() {
        return personneList;
    },

    /**
     * Mélange la liste et attribue un destinataire à chaque personne de manière naïve une fois le mélange fait:
     * 0 offre à 1, 1 offre à 2, ... , n-1 offre à n, n offre à 0
     * Envoie un mail à chaque personne pour l'informer du résultat du tirage
     */
    genererNaif: function genererNaif() {
        let resultat = false;
        if (personneList.length >= 2) {
            shuffleArray(personneList);
            for (let i = 0; i < personneList.length - 1; i++) {
                personneList[i].setdestinataire(personneList[i + 1]);
            }
            personneList[personneList.length - 1].setdestinataire(personneList[0]);
            sendMail();
            resultat = true;
        }
        return resultat;
    }
}

/**
 * Lors de l'ajout d'une personne, cette méthode vérifie si une personne existe déjà avec cet email
 * @param email l'email à vérifier
 * @returns true si la personne existe déjà, false sinon.
 */
function doesPersonneExist(email) {
    let resultat = false;
    let index = personneList.findIndex(personne => personne.getemail() === email);
    if (index !== -1) {
        resultat = true;
    }
    return resultat;
}

/**
 * Vérifie la validité de l'adresse mail
 * @param mail à vérifier
 * @returns true si l'email est valide, false sinon
 */
function checkMail(mail) {
    const regexMail = /(.+)@(.+)/;
    return regexMail.test(mail);
}

/**
 * Mélange aléatoirement la liste passée en paramètre en utilisant l'algorithme de Durstenfeld
 * @param array la liste à mélanger
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/**
 * Méthode utilisée pour envoyer un mail à chaque personne, en lui précisant son destinataire (la personne à qui
 * elle doit offrir un cadeau)
 */
function sendMail() {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'sans.quentin@gmail.com',
            pass: 'CODE-GENERE-VIA-GMAIL'
        }
    });

    personneList.forEach(personne => {
        let mailOptions = {
            from: 'sans.quentin@gmail.com',
            to: personne.getemail(),
            subject: 'Secret Santa BRHM',
            text: 'Coucou ' + personne.getnom() + '! Voici la personne à qui tu dois faire un cadeau pour le Secret Santa : ' + personne.getdestinataire().getnom() + ' - ' + personne.getdestinataire().getemail()
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending to ' + personne.getemail() + " - " + error);
            } else {
                console.log('Email sent to ' + personne.getemail() + " - " + info.response);
            }
        });
    });
}
