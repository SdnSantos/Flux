import { call, select, put, all, takeLatest } from 'redux-saga/effects';

import api from '../../../services/api';
import { formatPrice } from '../../../util/format';

import { addToCartSuccess, updateAmount } from './actions';

function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    console.tron.warn('ERRO');
    return;
  }

  if (productExists) {
    yield put(updateAmount(id, amount));
  } else {
    //call() - chamar action
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    //put() - disparar uma action
    yield put(addToCartSuccess(data));
  }
}

//all() - cria um listener para ficar ouvindo a aplicação
// juntar vários sagas
export default all([
  //takeLatest() - caso o usuário clique mais de uma vez no botão, antes da
  //chamada a api finalizar, o saga fica com o último clique e rejeita as anteriores
  takeLatest('@cart/ADD_REQUEST', addToCart),
]);
