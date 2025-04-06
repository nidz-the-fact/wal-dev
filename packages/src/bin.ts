#!/usr/bin/env node
import { Command, Option } from 'commander';

const program = new Command();

console.log((`
                            ▄▄                ▄▄                     
                          ▀███              ▀███                     
                            ██                ██                     
▀██▀    ▄█    ▀██▀▄█▀██▄    ██           ▄█▀▀███   ▄▄█▀██▀██▀   ▀██▀ 
  ██   ▄███   ▄█ ██   ██    ██         ▄██    ██  ▄█▀   ██ ██   ▄█   
   ██ ▄█  ██ ▄█   ▄█████    ██   █████ ███    ██  ██▀▀▀▀▀▀  ██ ▄█    
    ███    ███   ██   ██    ██         ▀██    ██  ██▄    ▄   ███     
     █      █    ▀████▀██▄▄████▄        ▀████▀███▄ ▀█████▀    █      
                                                                     
                                                                     

`));

program
  .name('wal')
  .description('wal-dev | npm package - Quick start toolkit for Walrus.')

program.parse(process.argv);
