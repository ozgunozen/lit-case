import {Router} from '@vaadin/router';

const router = new Router(document.querySelector('#outlet'));

router.setRoutes([
  {path: '/', component: 'list-page'},
  {path: '/create', component: 'create-page'},
  {path: '/edit/:id', component: 'edit-page'},
]);

export default router;
