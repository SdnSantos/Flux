import { call, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';

import { addToCartSuccess } from './actions';

function* addToCart({ id }) {
  //call() - chamar action
  const response = yield call(api.get, `/products/${id}`);

  //put() - disparar uma action
  yield put(addToCartSuccess(response.data));
}

//all() - cria um listener para ficar ouvindo a aplicação
// juntar vários sagas
export default all([
  //takeLatest() - caso o usuário clique mais de uma vez no botão, antes da
  //chamada a api finalizar, o saga fica com o último clique e rejeita as anteriores
  takeLatest('@cart/ADD_REQUEST', addToCart),
]);
