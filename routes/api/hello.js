export default async (fastify, options) => {

    fastify.get("/hello", async (req, res) => {

        res.send({
            success: true
        });

    });
    
}
