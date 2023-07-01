const App = new ElComponent({
    template: `
        <h1 style="{{style}}">{{title}}</h1>
        <button el-click="Edit">Edit Tilte</button>
    `,
    el: "#app",
    data: {
        title: 'Component',
        style: "color: black;",
        methods: {
            Edit() {
                App.update({ title: "Home", style: "color: red;" });
            }
        }
    }
});