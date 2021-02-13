const fetch = require('node-fetch')
const globals = require('../Global/Globals')

const endPoint = `${globals.OMDB_URL}?apikey=${globals.OMDB_APIKEY}`;

module.exports = new class OmdbClient {

    async getMovieById(id) {
        let endPointWithId = `${endPoint}&i=${id}`

        const movie = await fetch(endPointWithId)
                                .then(res => res.text())
                                .then(body => JSON.parse(body))
                                .catch(err => {
                                    throw new Error(err);
                                })

        return movie;
    }

    async getMovieByTitle(title){
        let endPointWithTitle = `${endPoint}&t=${title}`

        const movie = await fetch(endPointWithTitle)
                            .then(res => res.text())
                            .then(body => JSON.parse(body))
                            .catch(err => {
                                throw new Error(err);
                            })

        return movie;
    }

}