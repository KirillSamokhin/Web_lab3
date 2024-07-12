import express from 'express';
import body_parser from "body-parser";
import fs from "fs";
let router = express.Router();
router.use(body_parser.json({limit: '50mb'}));
router.use(body_parser.urlencoded({limit: '50mb', extended: true}));
router.use(express.json());

let data = fs.readFileSync('./src/json/sn.json', 'utf-8');
let soc_json = JSON.parse(data);

router.get('/', (req, res) => {
    res.render('index', {title: 'Admin mod', data: soc_json});
});

router.get('/friends/:id', (req, res) => {
    const id = req.params.id;
    let array = []
    for(let obj of soc_json){
        if(obj.id == id) {
            for(let user of soc_json){
                if(obj.friends.indexOf(user.id) != -1){
                    array.push(user);
                }
            }
            res.render('friends', {title: 'Admin mod', data: array, person: obj});
        }
    }
});

router.get('/news/:id', (req, res) => {
    const id = req.params.id;
    let array = []
    for(let obj of soc_json){
        if(obj.id == id) {
            for(let user of soc_json){
                if(obj.friends.indexOf(user.id) != -1){
                    array.push(user);
                }
            }
            res.render('news', {title: 'Admin mod', data: array, person: obj});
        }
    }
});

router.get('/setting/:id', (req, res) => {
    const id = req.params.id;
    for(let obj of soc_json){
        if(obj.id == id) {
            res.render('setting', {title: 'Admin mod', data: obj});
        }
    }
});

router.put('/set/:id', (req, res) => {
    const id = req.params.id;
    for(let obj of soc_json){
        if(obj.id == id){
            obj.name = req.body.name;
            obj.date = req.body.date;
            obj.email = req.body.email;
            obj.role = req.body.role;
            obj.status = req.body.status;
            res.status(201).json({ok: true});
        }
    }
});

router.post('/api/auth/register', (req, res) => {
    const newUser = req.body;

    const userId = soc_json.length;

    soc_json.push({
        id: userId,
        ...newUser
    });

    res.status(201).json({ message: 'User created successfully', user: { id: userId, ...newUser } });
});

router.post('/api/auth/login', (req, res) => {
    const {email} = req.body;
    const user = soc_json.find((user) => user.email === email);

    if (user) {
        // Успешная аутентификация
        res.json(user); // Возвращаем пользователя на клиентскую сторону
    } else {
        // Неуспешная аутентификация
        res.json({ success: false });
    }
});

router.get('/api/allNames', (req, res) => {
    res.json(soc_json);
});

router.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = soc_json.find(user => user.id === Number(userId));

    if (!user) {
        res.status(404).json({ error: 'Пользователь не найден' });
    } else {
        res.json(user);
    }
});

router.get('/api/friends/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = soc_json.find(user => user.id === Number(userId));

    if (!user) {
        res.status(404).json({ error: 'Пользователь не найден' });
    } else {
        let lst = []
        for(let obj of soc_json) {
            if (obj.id == userId) {
                for (let user of soc_json) {
                    if (obj.friends.indexOf(user.id) != -1) {
                        lst.push(user);
                    }
                }
            }
        }
        res.json(lst);
    }
});

router.delete('/api/user/:userId/delete-avatar', (req, res) => {
    const userId = req.params.userId;
    const user = soc_json.find(user => user.id === Number(userId));

    if (!user) {
        return res.status(404).send('Пользователь не найден');
    }

    user.photo = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAmgToSdzCG_-nvJwY2XmapBUFVlyQ6vBb99JNWEf7Xg&s';

    return res.status(200).json({ success: true, photoUrl: user.photoUrl });
});

router.post('/api/image-upload/:userId', (req,res) => {
    const userId = req.params.userId;
    const user = soc_json.find(user => user.id === Number(userId));
    const imageUrl = req.body.image;
    if (!user) {
        return res.status(404).send('Пользователь не найден');
    }

    user.photo = imageUrl;
    return res.status(200).json({ success: true, photoUrl: user.photoUrl });
});

router.post('/api/post-news/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = soc_json.find(user => user.id === Number(userId));

    if (!user) {
        res.status(404).send('Пользователь не найден');
    } else {
        const news = req.body.text;

        if (news) {
            user.news.push(news);
        } else {
            res.status(400).send('Новости не были предоставлены');
        }
    }
});

router.delete('/api/deleteFriend/:userId/:friendId', (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    const user = soc_json.find(user => user.id === Number(userId));
    if (!user) {
        res.status(404).send('Пользователь не найден');
    } else {
        const friendIndex = user.friends.findIndex(friend => friend == friendId);

        if (friendIndex !== -1) {
            user.friends.splice(friendIndex, 1);

            const removedFriendUser = soc_json.find(guy => guy.id == friendId);
            if (removedFriendUser) {
                const currentUserIndex = removedFriendUser.friends.findIndex(friend => friend == userId);
                if (currentUserIndex !== -1) {
                    removedFriendUser.friends.splice(currentUserIndex, 1);
                }
            }

            res.json({ message: 'Друг успешно удален' });
        } else {
            res.status(404).send('Друг не найден в списке друзей пользователя');
        }
    }
});

router.post('/api/addFriend/:userId', (req, res) => {
    const userId = req.params.userId;
    const friendId = req.body.friend;

    const user = soc_json.find(user => user.id === Number(userId));
    if (!user) {
        res.status(404).send('Пользователь не найден');
    } else {
        const friendIndex = user.friends.findIndex(friend => friend == friendId);

        if (friendIndex !== -1) {
            res.status(400).send('Друг с таким именем уже существует в списке друзей');
        } else {
            user.friends.push(friendId);
            res.json({ message: 'Друг успешно добавлен' });

            // Добавить текущего пользователя в список друзей друга
            const friendUser = soc_json.find(u => u.id == friendId);
            if (friendUser) {
                friendUser.friends.push(user.id);
            }
        }
    }
});

export {router};