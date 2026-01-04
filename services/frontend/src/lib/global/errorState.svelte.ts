
export const errorState = $state({
    message: "",
    status: 0,
    visible: false,

    show(msg: string, status: number = 500) {
        this.message = msg;
        this.status = status;
        this.visible = true;

        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.visible = false;
        }, 10000);
    }
});
