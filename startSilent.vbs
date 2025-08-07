' Cria um objeto Shell para executar comandos
Set WshShell = CreateObject("WScript.Shell")

' Executa o nosso script .bat de forma oculta (o '0') e não espera ele terminar ('false')
WshShell.Run "start.bat", 0, false

' Libera o objeto da memória
Set WshShell = Nothing