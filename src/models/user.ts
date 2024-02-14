import mongoose from 'mongoose';

interface IUser {
  name: string;
  avatar: string;
  about: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // имя — обязательное поле
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
});
// TS-интерфейс модели User

export default mongoose.model<IUser>('user', userSchema);
