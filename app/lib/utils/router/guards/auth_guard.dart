import 'package:auto_route/auto_route.dart';
import 'package:fson_host_app/utils/auth_manager.dart';

import '../../cache_manager.dart';
import '../app_router.dart';

class AuthGuard extends AutoRouteGuard {
  final _cacheMan = CacheManager.instance;

  @override
  Future<void> onNavigation(NavigationResolver resolver, StackRouter router) async {
    if (AuthManager.instance.authenticated) {
      resolver.next();
      return;
    }
    final String? password = await _cacheMan.readString('pwd');
    if (password != null) {
      final authenticated = await AuthManager.instance.authenticate(password);
      if (authenticated) {
        router.replace(const MainRoute());
        return;
      }
    }
    router.replace(const AuthRoute());
  }
}
