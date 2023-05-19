import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'gen/translations.g.dart';
import 'utils/cache_manager.dart';
import 'view/main_view.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  LocaleSettings.setLocaleRaw(await CacheManager.instance.readString('locale') ?? 'en');
  runApp(TranslationProvider(child: const App()));
}

class App extends StatelessWidget {
  const App({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'fson',
      themeMode: ThemeMode.dark,
      debugShowCheckedModeBanner: false,
      locale: TranslationProvider.of(context).flutterLocale, // use provider
      supportedLocales: AppLocaleUtils.supportedLocales,
      localizationsDelegates: GlobalMaterialLocalizations.delegates,
      home: const MainView(),
    );
  }
}
