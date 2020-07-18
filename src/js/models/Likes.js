export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);
        this.persistData(this.likes);

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex((item) => id === item.id);
        if (index === -1) {

            return;
        }
        this.persistData(this.likes);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.find(el => el.id === id);
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storedValue = localStorage.getItem('likes');
        if (storedValue) {
            this.likes = JSON.parse(storedValue);
        } else {
            this.likes = [];
        }
        
    }
}