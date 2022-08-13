class Chicken extends CollidableObject {
    y = 335; // height position
    height = 100; // img size
    width = 75;   // Horizontal Size
    IMAGES_WALKING = [
        'img/3.Secuencias_Enemy_básico/Versión_Gallinita (estas salen por orden de la gallina gigantona)/1.Ga_paso_derecho.png',
        'img/3.Secuencias_Enemy_básico/Versión_Gallinita (estas salen por orden de la gallina gigantona)/2-Ga_centro.png',
        'img/3.Secuencias_Enemy_básico/Versión_Gallinita (estas salen por orden de la gallina gigantona)/3.Ga_paso izquierdo.png',
        
    ]
    constructor() {
        super().loadImage('img/3.Secuencias_Enemy_básico/Versión_Gallinita (estas salen por orden de la gallina gigantona)/1.Ga_paso_derecho.png')
        this.loadImages(this.IMAGES_WALKING); // loads the array
        this.x = 200 + Math.random() * 500; // Calculaits the spawn from the chicken
        this.speed = 0.15 + Math.random() * 0.25; // Speed from Chicken
        this.animate();
    }
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000/ 60); //60 FPS

        

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

}