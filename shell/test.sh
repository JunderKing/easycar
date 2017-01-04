#!/bin/bash
for (( i = 1; i < 10; i++ )); do
    for (( j = 1; j < i + 1; j++ )); do
        product=`expr ${i} \* ${j}`
        echo -e "${j}*${i}=${product} \c"
    done
    echo -e "\n"
done
