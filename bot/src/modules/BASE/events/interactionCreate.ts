import { Bot } from "../../../structures/Bot";
import { Event } from "../../../structures/Event";
import { Interaction, CacheType, Events, Collection } from 'discord.js';
import { Module } from "../../../structures/Module";
import { handleInteractionError } from "../utils/ErrorHandling";


const cooldowns = new Collection<string, Collection<string, number>>();


module.exports = new Event(Events.InteractionCreate, async(client : Bot, mod: Module, interaction: Interaction<CacheType>) => {
    if(!interaction.isChatInputCommand()) return;

    const commands = mod.commands;
    const command = commands.get(interaction.commandName);

    // No error since this will become a common scenario when more modules are added
    if(!command) return;

    try {
        // Check for cooldown data first
        
        let shouldRun = true, elapsed = -1;
        const now = Date.now(), cooldown = command.options?.cooldown;

        if(cooldown && cooldown > 0){

            // Initialize collection first
            if(!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());
            const timestamps = cooldowns.get(command.data.name);
            // Check for user cooldown data
            const userLastUse = timestamps?.get(interaction.user.id);

            if(userLastUse){
                elapsed = now - userLastUse;
                const cooldownMS = cooldown * 1000;
                shouldRun = elapsed > cooldownMS;
                // No need to remove the timestamp as it will get overwritten later (after running the command, the cooldown is set again)
            }
        }

        if(shouldRun){
            command.run(client, mod, interaction);
    
            // Add a cooldown (if enabled)
            if(cooldown && cooldown > 0){
                const timestamps = cooldowns.get(command.data.name); // will always return a value
                timestamps?.set(interaction.user.id, now);
            }
        }else if(elapsed != -1 && cooldown){
            // Reply a message that command is still on cooldown
            await interaction.reply({ content: `This command is still on cooldown for you, please wait for ${(cooldown - elapsed/1000).toFixed(2)}s`, ephemeral: true});
        }

    }catch (err) {
        await handleInteractionError(interaction, err);
    }
});