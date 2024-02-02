#!/bin/bash

AWS_PROFILE=$1
AWS_REGION=$2
CRITERIO=$3
# LAYER="DatabaseAppLayer-goid-dev"

# Lista todas las funciones Lambda
FUNCTIONS=$(aws lambda list-functions --region $AWS_REGION --profile $AWS_PROFILE --query "Functions[?contains(FunctionName, '$CRITERIO')].FunctionName" --output json)


# Itera sobre cada función y elimina versiones antiguas (excluyendo las dos últimas)
for function_name in $FUNCTIONS; do
    cadena_sin_comillas=$(echo $function_name | tr -d ',')
    cadena_sin_llaves1=$(echo $cadena_sin_comillas | tr -d '"')

    # Obtiene la lista de versiones (excepto las dos últimas)
    if [ "$cadena_sin_llaves1" != "[" ] && [ "$cadena_sin_llaves1" != "]" ]; then
        echo "Eliminando versiones antiguas para la función: $cadena_sin_llaves1"
        
        VERSIONS=$(aws lambda list-versions-by-function --function-name $cadena_sin_llaves1 --region $AWS_REGION --profile $AWS_PROFILE --query 'Versions[?Version != `$LATEST`].Version' --output json)

        VERSIONS_COUNT=$(echo "$VERSIONS" | jq -r length)
        VERSIONS_COUNT_ONLY_DIGITS=$(echo "$VERSIONS_COUNT" | tr -cd '[:digit:]')

        if ["$VERSIONS_COUNT_ONLY_DIGITS" == "0"]; then
            echo "No hay versiones antiguas para la función: $cadena_sin_llaves1"
        else
            # Itera sobre las versiones y elimina cada una
            for version in $VERSIONS; do
            
                numero=$(echo "$version" | tr -d '\r' | awk -F',' '{print $1}')
                cadena_limpia=$(echo "$numero" | tr -d "'" | tr -d '"')
                
                if [ "$cadena_limpia" != "[" ] && [ "$cadena_limpia" != "]" ]; then
                    echo "Eliminando Version $cadena_limpia >>>"
                    aws lambda delete-function --function-name $cadena_sin_llaves1 --qualifier $cadena_limpia --region $AWS_REGION --profile $AWS_PROFILE
                    echo "<<< Version $cadena_limpia Eliminada!\n"
                fi
            done
        fi    
    fi

done

echo "Operación completada."
