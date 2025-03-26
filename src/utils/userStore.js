import {create} from 'zustand';
import {jwtDecode} from 'jwt-decode';

const userStore = create((set) => ({
  userInfo: {
    id: '',
    name: ''
  },
  isLogin: false,
  setUp: () => {
    const token = localStorage.getItem("token");
    if (!token || typeof token !== 'string') {
      return;
    }
    try {
      const payload = jwtDecode(token);
      set({
        userInfo: {
          id: payload.sub,
          name: payload.userName
        },
        isLogin: true,
      });
    } catch (error) {
      throw new Error(`토큰 파싱 에러: ${error}`);
    }
  },
  reset: () => {
    set({
      userInfo: {id: '', name: ''},
      isLogin: false,
    });
    localStorage.removeItem('token'); // set의 콜백이 아니라 별도로 호출
  },
}));

export default userStore;