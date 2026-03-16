export const successState = $state({
    message: "",
    visible: false,

    show(msg: string) {
        this.message = msg;
        this.visible = true;

        setTimeout(() => {
            this.visible = false;
        }, 2000);
    }
});
