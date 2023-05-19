import 'package:flutter/foundation.dart';

abstract class AppConfig {
  static String get apiUrl {
    if (kDebugMode) {
      return 'http://192.168.0.21:21800';
    }
    return Uri.base.toString().split("/#/").elementAt(0);
  }
}
