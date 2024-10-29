class Juego{
    constructor(){
        // Inicializar la aplicacion PixiJS
        this.contadorDeFrame = 0;
        this.ancho =  1280;
        this.alto = 720;
        this.app = new PIXI.Application();
        
        let promesa = this.app.init({width: this.ancho, height: this.alto});

        /* Esta promesa es creada para que, luego de que inicie la aplicacion PixiJS, recien ahi agregue lo necesario. 
           De otra manera daria problemas de sincronizacion.*/
        

        promesa.then((e) => {        
            document.body.appendChild(this.app.view);
            // Inicializar Matter.js
            this.engine = Matter.Engine.create();
            this.world = this.engine.world;
            this.inicializarRenderDeMatter();

            /*
            Siempre que se cree alguna entidad, esta estara
            renderizada en PixiJS y su cuerpo fisico en Matter
            Finalmente se sincroniza en el gameLoop()
            */
            this.nivel = new Nivel(this.world, this.app, this.alto, this.ancho);
            this.jugador = new Jugador(this.world, this.app, this.alto, this.ancho);
            hacerJugadorVariableGlobal(this.jugador);
            Matter.Events.on(this.engine, 'collisionStart', (e) => {
            this.jugador.detectarColisiones(e.pairs);
            });
            Matter.Events.on(this.engine, 'collisionEnd', (e) => {
            this.jugador.detectarFinColision(e.pairs);
            });
            
            // Bucle del juego. Se agrega al ticker (bucle) de PixiJS.
            this.app.ticker.add(() => {
                this.gameLoop();
            });
        });
    }

    inicializarRenderDeMatter(){
        let render = Matter.Render.create({
            element: document.body,
            engine: this.engine,
            options: {
                wireframes: true
            }
        });
        Matter.Render.run(render);
    }

    gameLoop(){
        this.contadorDeFrame++;
        Matter.Engine.update(this.engine, 1000 / 60); // Actualizar el motor de fisica
        this.jugador.update(); // Actualizar el jugador
        this.nivel.update(); // Actualizar el nivel
    };
}