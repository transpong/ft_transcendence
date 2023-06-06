#!/bin/bash

# Verificar se existem variáveis de ambiente do Vite
vite_env_variables=$(printenv | grep -E "^VITE_" | sed 's/^\(.*\)=.*$/\1/' | tr '\n' ' ')

if [ -z "$vite_env_variables" ]; then
  echo "Erro: Não foram encontradas variáveis de ambiente do Vite."
  # print env
  # printenv
  exit 1
fi

# Criar arquivo .env
touch .env

# Importar variáveis de ambiente do Docker
set -a
source .env
set +a

# Filtrar variáveis de ambiente do Vite
vite_env_variables=$(printenv | grep -E "^VITE_" | sed 's/^\(.*\)=.*$/\1/' | tr '\n' ' ')

# Escrever as variáveis de ambiente do Vite no arquivo .env
for variable in $vite_env_variables; do
  echo "$variable=${!variable}" >> .env

#   # cat no .env
#   printenv
#   exit 1
done
