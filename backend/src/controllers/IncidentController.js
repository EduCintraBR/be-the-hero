const connection = require('../database/connection');

module.exports = {
  async index (request, response) {
    const { page = 1 } = request.query;
    
    /* Estou passando o count com colchetes para acessar a posição dele dentro do array */
    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
    .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
    .limit(5)
    .offset((page - 1) * 5)
    .select('incidents.*', 'ongs.name', 
            'ongs.email', 'ongs.whatsapp',
            'ongs.city', 'ongs.uf');

    /* Inserindo no header da resposta o total de casos que existe no banco */
    response.header('X-Total-Count', count['count(*)'])

    return response.json(incidents);
  },

  async create (request, response) {
    const { title, description, value } = request.body;
    const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ong_id,
    });

    return response.json({ id });
  },

  async delete(request, response){
    const { id } = request.params;
    const ong_id = request.headers.authorization;

    const incident = await connection('incidents')
    .where('id', id)
    .select('ong_id')
    .first();
    /* BUSCA O ID DA ONG E VERIFICA SE É O MESMO PASSADO PELO HEADER */
    if (incident.ong_id !== ong_id) {
      return response.status(401).json({ error: 'Operação não permitida.' });
    }
    /* DELETA O INCIDENT */
    await connection('incidents').where('id', id).delete();
    response.status(204).send();
  }
};