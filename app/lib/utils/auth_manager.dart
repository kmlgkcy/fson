import 'package:dio_wrapper/dio_wrapper.dart';
import 'package:flutter/foundation.dart';

import '../config.dart';
import 'cache_manager.dart';

class AuthResponse {
  AuthResponseCode code;
  String? message;
  AuthResponse({
    required this.code,
    this.message,
  });
}

enum AuthResponseCode { success, notFound, badRequest, internal, unknown }

class AuthManager {
  static AuthManager? _instance;
  static AuthManager get instance {
    _instance ??= AuthManager._init();
    return _instance!;
  }

  bool authenticated = false;
  final http = RequestManager.instance;
  final cache = CacheManager.instance;
  Map<String, String> authHeader = {'x-auth-password': 'password'};
  AuthManager._init();

  Future<bool> authenticate(String password) async {
    try {
      final res = await http.request(
        '${AppConfig.apiUrl}/auth',
        options: ReqOptions(
          headers: {'x-auth-password': password},
          method: HttpMethod.get.value,
          receiveDataWhenStatusError: true,
        ),
      );
      if (res != null) {
        if (res.statusCode == 200) {
          authHeader = {'x-auth-password': password};
          await cache.writeString('pwd', password);
          authenticated = true;
          return true;
        }
      }
      authenticated = false;
      await cache.removeString('pwd');
      return false;
    } catch (e) {
      if (kDebugMode) {
        print(e.toString());
      }
      return false;
    }
  }

  Future<void> clear() async {
    await cache.removeString('pwd');
  }
}
